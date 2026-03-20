'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface Project {
    slug: string;
    title: string;
    image: string;
    minCapital: number;
    recommendationScore: number;
}

interface ProjectContextType {
    joinedProjects: Project[];
    joinProject: (project: Project) => void;
    leaveProject: (slug: string) => void;
    isJoined: (slug: string) => boolean;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
    const [joinedProjects, setJoinedProjects] = useState<Project[]>([]);

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('joined_projects');
        if (saved) {
            try {
                setJoinedProjects(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse saved projects', e);
            }
        }
    }, []);

    // Save to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('joined_projects', JSON.stringify(joinedProjects));
    }, [joinedProjects]);

    const joinProject = (project: Project) => {
        if (!joinedProjects.find(p => p.slug === project.slug)) {
            setJoinedProjects([...joinedProjects, project]);
        }
    };

    const leaveProject = (slug: string) => {
        setJoinedProjects(joinedProjects.filter(p => p.slug !== slug));
    };

    const isJoined = (slug: string) => {
        return !!joinedProjects.find(p => p.slug === slug);
    };

    return (
        <ProjectContext.Provider value={{ joinedProjects, joinProject, leaveProject, isJoined }}>
            {children}
        </ProjectContext.Provider>
    );
}

export function useProjects() {
    const context = useContext(ProjectContext);
    if (context === undefined) {
        throw new Error('useProjects must be used within a ProjectProvider');
    }
    return context;
}

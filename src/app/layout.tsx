import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "云创业 - 云端仿真实验平台",
  description: "助力每一个创业梦想的云端仿真平台",
  icons: {
    icon: "/icon.svg",
  },
};

import { ProjectProvider } from "@/context/ProjectContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ProjectProvider>
          {children}
        </ProjectProvider>
      </body>
    </html>
  );
}

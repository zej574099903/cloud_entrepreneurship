import { NextRequest, NextResponse } from 'next/server';
import { getEntrepreneurAdvice } from '@/lib/ai/deepseek';

export async function POST(req: NextRequest) {
    try {
        const { category, results, scenario } = await req.json();

        if (!category || !results) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const advice = await getEntrepreneurAdvice(category, results, scenario);

        return NextResponse.json({ advice });
    } catch (error) {
        console.error('Advice API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

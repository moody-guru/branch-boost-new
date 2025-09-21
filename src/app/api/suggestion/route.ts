//new API endpoint. It will receive a user's task prompt, call the Gemini AI to get a suggestion, and return the response to the client.

// src/app/api/suggestion/route.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// Initialize the Google Generative AI client with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const { taskName, branch } = await request.json();

    if (!taskName || !branch) {
      return NextResponse.json(
        { error: 'Task name and branch are required.' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // This is the prompt we send to the AI.
    // It's designed to give specific, actionable advice based on the user's engineering branch.
    const prompt = `
      You are an expert mentor for engineering students.
      A student in the "${branch}" branch has the following task: "${taskName}".

      Your instructions are:
      1.  Provide a concise, actionable, step-by-step guide to accomplishing this task.
      2.  Suggest one or two additional skills, tools, or small projects related to this task that would help them stand out in their field.
      3.  Keep the total response under 150 words.
      4.  Format the output clearly using markdown for headings and lists.
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const suggestionText = response.text();

    return NextResponse.json({ suggestion: suggestionText });
  } catch (error) {
    console.error('Error generating suggestion:', error);
    return NextResponse.json(
      { error: 'Failed to generate suggestion.' },
      { status: 500 }
    );
  }
}



































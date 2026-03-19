import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch(
      "https://n8n.jewelemarket.cloud/webhook/status-check"
    );

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
}
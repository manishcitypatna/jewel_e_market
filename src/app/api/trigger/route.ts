import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("BODY:", body);

    const res = await fetch(process.env.N8N_WEBHOOK_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const text = await res.text();
    console.log("N8N RESPONSE:", text);

    return NextResponse.json({ success: true, data: text });
  } catch (error: any) {
    console.error("TRIGGER ERROR:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';

export async function GET() {
  const token = process.env.MONDAY_API_TOKEN;
  const boardId = process.env.DEALS_BOARD_ID;

  if (!token || !boardId) {
    return NextResponse.json({ connected: false, error: 'Missing credentials' }, { status: 500 });
  }

  try {
    const query = `
      query {
        boards(ids: [${boardId}]) {
          name
        }
      }
    `;

    const response = await fetch('https://api.monday.com/v2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
        'API-Version': '2023-10'
      },
      body: JSON.stringify({ query })
    });

    if (response.ok) {
      const data = await response.json();
      if (!data.errors) {
        return NextResponse.json({ connected: true });
      }
    }
    
    return NextResponse.json({ connected: false, error: 'API Request failed' }, { status: 500 });
  } catch (error) {
    return NextResponse.json({ connected: false, error: String(error) }, { status: 500 });
  }
}

import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return new Response(JSON.stringify({ success: false, message: 'Invalid payload' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const accessKey = process.env.WEB3FORMS_API_KEY;
    if (!accessKey) {
      return new Response(JSON.stringify({ success: false, message: 'Server not configured for direct sending' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    const resp = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: accessKey,
        name,
        email,
        subject,
        message,
        from_name: name,
        replyto: email
      })
    });

    const result = await resp.json();

    if (!resp.ok || !result.success) {
      return new Response(JSON.stringify({ success: false, message: result.message || 'Upstream failed' }), { status: 502, headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('contact api error', err);
    return new Response(JSON.stringify({ success: false, message: 'Server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

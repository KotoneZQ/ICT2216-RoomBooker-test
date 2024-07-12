import { NextResponse } from 'next/server';

const memoryStore = new Map();

export async function middleware(req) {
  const ip = req.headers.get('x-forwarded-for') || req.ip || '::1';
  const now = Date.now();

  console.log('Middleware start');
  console.log(`Request from IP: ${ip}`);

  if (!memoryStore.has(ip)) {
    memoryStore.set(ip, { count: 1, lastRequestTime: now });
    console.log(`New IP: ${ip}, count: 1`);
  } else {
    const requestInfo = memoryStore.get(ip);

    if (now - requestInfo.lastRequestTime > 1 * 60 * 1000) {
      requestInfo.count = 1;
      requestInfo.lastRequestTime = now;
      console.log(`Resetting count for IP: ${ip}`);
    } else {
      requestInfo.count += 1;
    }

    memoryStore.set(ip, requestInfo);
    console.log(`IP: ${ip}, count: ${requestInfo.count}`);

    if (requestInfo.count > 100) {
      const htmlResponse = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Rate Limit Exceeded</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f5f5dc;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
              }
              .container {
                text-align: center;
                background-color: white;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
              }
              h1 {
                color: #ff6347;
              }
              p {
                color: #333;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Too Many Requests</h1>
              <p>You have made too many requests. Please try again later.</p>
            </div>
          </body>
        </html>
      `;
      return new NextResponse(htmlResponse, {
        status: 429,
        headers: { 'Content-Type': 'text/html' }
      });
    }
  }

  console.log('Middleware executed');
  return NextResponse.next();
}

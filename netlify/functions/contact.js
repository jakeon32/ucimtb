const { Resend } = require('resend');

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

exports.handler = async (event) => {
    // CORS preflight
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers: CORS_HEADERS, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
            body: JSON.stringify({ success: false, message: 'Method not allowed' }),
        };
    }

    let body;
    try {
        body = JSON.parse(event.body);
    } catch (e) {
        return {
            statusCode: 400,
            headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
            body: JSON.stringify({ success: false, message: 'Invalid request body' }),
        };
    }

    const { name, email, message, lang } = body;

    if (!name || !email || !message) {
        return {
            statusCode: 400,
            headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
            body: JSON.stringify({ success: false, message: 'Name, email, and message are required.' }),
        };
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const toEmail = process.env.CONTACT_TO_EMAIL || 'hospitality@groundk.com';

    try {
        await resend.emails.send({
            from: 'DiscoverK <noreply@discoverk.com>',
            to: [toEmail],
            replyTo: email,
            subject: `[DiscoverK] New inquiry from ${name}`,
            text: [
                `Name: ${name}`,
                `Email: ${email}`,
                `Language: ${lang || 'en'}`,
                '',
                '--- Message ---',
                message,
            ].join('\n'),
        });

        return {
            statusCode: 200,
            headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
            body: JSON.stringify({ success: true, message: 'Your inquiry has been sent successfully.' }),
        };
    } catch (error) {
        console.error('Resend error:', error);
        return {
            statusCode: 500,
            headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
            body: JSON.stringify({ success: false, message: 'Failed to send email. Please try again later.' }),
        };
    }
};

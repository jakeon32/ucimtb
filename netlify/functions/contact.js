let Resend;
try {
    Resend = require('resend').Resend;
} catch (e) {
    console.error('Failed to load resend module:', e.message);
}

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const jsonResponse = (statusCode, data) => ({
    statusCode,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
});

exports.handler = async (event) => {
    // CORS preflight
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers: CORS_HEADERS, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return jsonResponse(405, { success: false, message: 'Method not allowed' });
    }

    // Check dependencies
    if (!Resend) {
        console.error('resend module not available');
        return jsonResponse(500, { success: false, message: 'Email service is not configured.' });
    }

    if (!process.env.RESEND_API_KEY) {
        console.error('RESEND_API_KEY environment variable is not set');
        return jsonResponse(500, { success: false, message: 'Email service is not configured.' });
    }

    let body;
    try {
        body = JSON.parse(event.body);
    } catch (e) {
        return jsonResponse(400, { success: false, message: 'Invalid request body' });
    }

    const { name, email, message, lang } = body;

    if (!name || !email || !message) {
        return jsonResponse(400, { success: false, message: 'Name, email, and message are required.' });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const toEmail = process.env.CONTACT_TO_EMAIL || 'hospitality@groundk.com';

    try {
        const result = await resend.emails.send({
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

        if (result.error) {
            console.error('Resend API error:', JSON.stringify(result.error));
            return jsonResponse(500, { success: false, message: 'Failed to send email: ' + (result.error.message || 'Unknown error') });
        }

        return jsonResponse(200, { success: true, message: 'Your inquiry has been sent successfully.' });
    } catch (error) {
        console.error('Resend error:', error.message || error);
        return jsonResponse(500, { success: false, message: 'Failed to send email. Please try again later.' });
    }
};

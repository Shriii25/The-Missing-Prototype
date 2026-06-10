export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Grab the hidden URL from Vercel's environment variables
        const GOOGLE_SHEETS_URL = process.env.SECRET_GOOGLE_URL;

        if (!GOOGLE_SHEETS_URL) {
            console.error("Missing Google Sheets URL in environment variables.");
            return res.status(500).json({ error: 'Server configuration error' });
        }

        // Convert the incoming JSON from the frontend into the URL format Google expects
        const params = new URLSearchParams(req.body);

        // Forward the data to your hidden Google database
        const googleResponse = await fetch(GOOGLE_SHEETS_URL, {
            method: 'POST',
            body: params
        });

        if (!googleResponse.ok) {
            throw new Error('Failed to reach database');
        }

        // Tell the frontend the submission was successful
        return res.status(200).json({ success: true });
        
    } catch (error) {
        console.error("Proxy Error:", error);
        return res.status(500).json({ error: 'Failed to transmit data' });
    }
}

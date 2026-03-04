'use server';

export async function testSmsAction(phone: string, message: string) {
    try {
        console.log('Testing SMS to:', phone);

        // Moolre SMS API only requires X-API-VASKEY for authentication
        // See: https://docs.moolre.com/#/send-sms
        const smsVasKey = process.env.MOOLRE_SMS_API_KEY;

        const envDebug = {
            MOOLRE_SMS_API_KEY: smsVasKey ? 'Set' : 'Unset',
        };

        if (!smsVasKey) {
            return {
                success: false,
                error: 'Missing MOOLRE_SMS_API_KEY environment variable',
                envOfServer: envDebug
            };
        }

        // Format phone number for Ghana
        let cleaned = phone.replace(/\D/g, '');
        if (cleaned.startsWith('0')) {
            cleaned = '233' + cleaned.slice(1);
        }
        if (!cleaned.startsWith('233') && cleaned.length === 9) {
            cleaned = '233' + cleaned;
        }
        const recipient = '+' + cleaned;

        // Make API call per Moolre documentation
        const response = await fetch('https://api.moolre.com/open/sms/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-VASKEY': smsVasKey
            },
            body: JSON.stringify({
                type: 1,
                senderid: process.env.SMS_SENDER_ID || 'Prishane',
                messages: [
                    {
                        recipient: recipient,
                        message: message
                    }
                ]
            })
        });

        const responseText = await response.text();
        let result;
        try {
            result = JSON.parse(responseText);
        } catch {
            result = { rawResponse: responseText };
        }

        return {
            success: result?.status === 1,
            result,
            formattedPhone: recipient,
            httpStatus: response.status,
            envOfServer: envDebug
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message,
            stack: error.stack
        };
    }
}

import crypto from "crypto"

/**
 * Solapi 메시지 발송 유틸리티
 */
export async function sendSMS({
    to,
    text,
    scheduledDate
}: {
    to: string
    text: string
    scheduledDate?: string
}) {
    const apiKey = process.env.SOLAPI_API_KEY
    const apiSecret = process.env.SOLAPI_API_SECRET
    const from = process.env.SOLAPI_SENDER_NUMBER || "07080640475"

    if (!apiKey || !apiSecret) {
        console.warn("SOLAPI API Key or Secret is missing. Skipping message send.")
        return
    }

    const salt = crypto.randomBytes(16).toString("hex")
    const date = new Date().toISOString()
    const hmac = crypto.createHmac("sha256", apiSecret)
    hmac.update(date + salt)
    const signature = hmac.digest("hex")

    const authorization = `HMAC-SHA256 apiKey=${apiKey}, date=${date}, salt=${salt}, signature=${signature}`

    try {
        const response = await fetch("https://api.solapi.com/messages/v4/send-many", {
            method: "POST",
            headers: {
                Authorization: authorization,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                messages: [
                    {
                        to,
                        from,
                        text,
                        ...(scheduledDate && { scheduledDate })
                    }
                ]
            })
        })

        const result = await response.json()
        if (!response.ok) {
            console.error("Solapi Send Error:", result)
        }
        return result
    } catch (error) {
        console.error("Solapi Network Error:", error)
    }
}

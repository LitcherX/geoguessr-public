import axios from "axios";

const DISCORD_API_BASE = "https://discord.com/api/v10";

export class WebhookClient {
    constructor(webhookUrl) {
        this.webhookUrl = webhookUrl;
        this.headers = {
            "Content-Type": "application/json",
            "User-Agent": "DiscordBot",
        };
    }

    async send(payload) {
        try {
            const response = await axios.post(this.webhookUrl, payload, {
                headers: this.headers,
            });
            return response.data;
        } catch (error) {
            console.error(
                "Error sending webhook:",
                error.response?.data || error.message
            );
            throw error;
        }
    }
}

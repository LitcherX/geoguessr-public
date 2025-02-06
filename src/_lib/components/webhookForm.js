import axios from "axios";

const DiscordWebhookSender = ({ webhookUrl }) => {
    const sendWebhook = async () => {
        console.log("test", webhookUrl);
        try {
            await axios.post(webhookUrl, {
                content: "Hello from Next.js!",
            });
            console.log("Webhook sent successfully!");
        } catch (error) {
            console.error("Error sending webhook:", error);
        }
    };

    return <button onClick={sendWebhook}>Send Discord Webhook</button>;
};

export default DiscordWebhookSender;

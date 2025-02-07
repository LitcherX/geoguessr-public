export async function sendDiscordNotification(
    userId,
    message,
    userImage,
    newRank,
    previousRank
) {
    try {
        const dmChannelResponse = await fetch(
            `https://discord.com/api/v10/users/@me/channels`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ recipient_id: userId }),
            }
        );

        const dmChannel = await dmChannelResponse.json();

        if (!dmChannel.id) {
            console.error("Failed to create DM channel:", dmChannel);
            return;
        }

        const avatarImage = await fetch(userImage);

        const embed = {
            title: "Oh no, someone passed you",
            description: message,
            color: 0x8b0000,
            timestamp: new Date(),
            footer: {
                text: "If you wish to disable notifications, head to https://geoguess.gamrtag.xyz/me",
            },
            fields: [
                {
                    name: "New Rank",
                    value: `Your new rank is ${newRank}`,
                    inline: true,
                },
                {
                    name: "Previous Rank",
                    value: `Your previous rank was ${previousRank}`,
                    inline: true,
                },
            ],
            thumbnail: {
                url:
                    avatarImage.status === 200
                        ? userImage
                        : "https://geoguess.gamrtag.xyz/images/placeholder.png",
            },
        };

        const messageResponse = await fetch(
            `https://discord.com/api/v10/channels/${dmChannel.id}/messages`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    embeds: [embed],
                    contents: "New notification!",
                }),
            }
        );

        if (!messageResponse.ok) {
            const errorData = await messageResponse.json();
            console.error("Failed to send message:", errorData);
            return;
        }

        console.log("Notification sent!");
    } catch (error) {
        console.error("Error:", error);
    }
}

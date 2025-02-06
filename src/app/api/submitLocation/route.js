import { NextResponse } from "next/server";
import {
    DiscordEmbed,
    DiscordNotifier,
    DiscordMessage,
} from "discord-webhook-notifier";
import { auth } from "@/app/auth";

export const dynamic = "auto"; // or 'force-dynamic', 'error', 'force-static'
export const runtime = "nodejs"; // or 'edge'
export const revalidate = false;

export const POST = auth(async (request, response) => {
    const user = request.auth.user;
    if (user.banned) {
        return NextResponse.json({ banned: true }, { status: 403 });
    }

    const hook = new DiscordNotifier(process.env.DISCORD_WEBHOOK_URL);
    const formData = await request.formData();
    const url = formData.get("url");
    const message = formData.get("message");

    try {
        const id = user.image.match(/(?<=\/avatars\/)(\d+)(?=\/)/gm)[0];
        let discordUser = await fetch(
            `https://discord.com/api/v9/users/${id}`,
            {
                headers: {
                    Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
                },
            }
        );
        discordUser = await discordUser.json();
        /* let guildUser = await fetch(
            `https://discord.com/api/v10/guilds/${process.env.DISCORD_SERVER_ID}/members/${id}`,
            {
                headers: {
                    Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
                },
            }
        );
        guildUser = await guildUser.json(); */
        const embed = new DiscordEmbed()
            .setImage(url)
            .setTimestamp()
            .setFooter(`This is a verification log`, user.image)
            .setAuthor(
                user.name,
                `https://discord.com/users/${discordUser.id}`,
                user.image
            )
            .setDescription(`<@${discordUser.id}>\n${message}`);
        const dc = new DiscordMessage().addEmbed(embed);
        await hook.notify(dc);

        // Return the blob details along with the message
        return NextResponse.json(
            {
                message: "Sent",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error submitting embed:", error);
        return NextResponse.json(
            { error: "Failed to upload file" },
            { status: 500 }
        );
    }
});

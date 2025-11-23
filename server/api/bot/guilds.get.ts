// Endpoint to verify in which servers the bot is
// This requires a Discord bot configured

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const botToken = config.botToken;

    if (!botToken) {
        // If no bot token, return empty list
        // This means that no server has the bot
        return [];
    }

    try {
        // Use cache for 5 minutes to reduce Discord API calls
        const botGuilds = await cachedFunction(
            async () => {
                const response = await fetch("https://discord.com/api/v10/users/@me/guilds", {
                    headers: {
                        Authorization: `Bot ${botToken}`,
                    },
                });

                if (!response.ok) {
                    console.error("Failed to fetch bot guilds:", response.status);
                    return [];
                }

                return await response.json();
            },
            {
                maxAge: 60 * 5, // 5 minutes
                name: "bot-guilds",
                getKey: () => "bot-guilds",
            }
        )();

        // Return only guild IDs
        return botGuilds.map((guild: any) => guild.id);
    } catch (error) {
        console.error("Bot guilds fetch error:", error);
        return [];
    }
});

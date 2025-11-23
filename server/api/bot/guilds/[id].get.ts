// Endpoint to get guild data using bot
export default defineEventHandler(async (event) => {
    const guildId = getRouterParam(event, "id");
    const config = useRuntimeConfig();
    const botToken = config.botToken;

    if (!guildId) {
        throw createError({
            statusCode: 400,
            statusMessage: "Guild ID is required",
        });
    }

    if (!botToken) {
        throw createError({
            statusCode: 503,
            statusMessage: "Bot token not configured",
        });
    }

    try {
        // Get guild data using bot
        const guildResponse = await fetch(`https://discord.com/api/v10/guilds/${guildId}?with_counts=true`, {
            headers: {
                Authorization: `Bot ${botToken}`,
            },
        });

        if (!guildResponse.ok) {
            if (guildResponse.status === 404) {
                throw createError({
                    statusCode: 404,
                    statusMessage: "Bot is not in this server",
                });
            }
            throw createError({
                statusCode: guildResponse.status,
                statusMessage: "Failed to fetch guild from Discord",
            });
        }

        const guild = await guildResponse.json();
        return guild;
    } catch (error: any) {
        console.error("Bot guild fetch error:", error);

        if (error.statusCode) {
            throw error;
        }

        throw createError({
            statusCode: 500,
            statusMessage: "Failed to fetch guild data",
        });
    }
});

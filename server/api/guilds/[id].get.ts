import { decryptData } from "#imports";

export default defineEventHandler(async (event) => {
    const guildId = getRouterParam(event, "id");
    const config = useRuntimeConfig();

    if (!guildId) {
        throw createError({
            statusCode: 400,
            statusMessage: "Guild ID is required",
        });
    }

    const sessionCookie = getCookie(event, "auth_session");

    if (!sessionCookie) {
        throw createError({
            statusCode: 401,
            statusMessage: "Not authenticated",
        });
    }

    try {
        const sessionData = JSON.parse(sessionCookie);

        // Verify expiration
        if (sessionData.expiresAt && Date.now() > sessionData.expiresAt) {
            deleteCookie(event, "auth_session");
            throw createError({
                statusCode: 401,
                statusMessage: "Session expired",
            });
        }

        // First try to get bot data if configured
        if (config.botToken) {
            try {
                const botGuildResponse = await fetch(`https://discord.com/api/v10/guilds/${guildId}?with_counts=true`, {
                    headers: {
                        Authorization: `Bot ${config.botToken}`,
                    },
                });

                if (botGuildResponse.ok) {
                    const botGuild = await botGuildResponse.json();
                    return {
                        ...botGuild,
                        hasBot: true,
                    };
                }
            } catch (error) {
                // If fails with bot, continue with user method
                console.log("Bot fetch failed, falling back to user guilds");
            }
        }

        // Fallback: get from user guilds list
        const tokensData = decryptData(sessionData.tokens);
        if (!tokensData) {
            throw createError({
                statusCode: 500,
                statusMessage: "Failed to decrypt tokens",
            });
        }

        const { accessToken } = JSON.parse(tokensData);

        const guildsResponse = await fetch("https://discord.com/api/v10/users/@me/guilds", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!guildsResponse.ok) {
            throw createError({
                statusCode: guildsResponse.status,
                statusMessage: "Failed to fetch guilds from Discord",
            });
        }

        const guilds = await guildsResponse.json();
        const guild = guilds.find((g: any) => g.id === guildId);

        if (!guild) {
            throw createError({
                statusCode: 404,
                statusMessage: "Guild not found or you don't have access",
            });
        }

        // Return with limited information (no bot)
        return {
            ...guild,
            hasBot: false,
            approximate_member_count: null,
            approximate_presence_count: null,
        };
    } catch (error: any) {
        console.error("Guild fetch error:", error);

        if (error.statusCode) {
            throw error;
        }

        throw createError({
            statusCode: 500,
            statusMessage: "Failed to fetch guild",
        });
    }
});

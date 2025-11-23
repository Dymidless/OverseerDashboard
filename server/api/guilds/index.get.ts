import { decryptData } from "#imports";

export default defineEventHandler(async (event) => {
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

        // Decrypt tokens
        const tokensData = decryptData(sessionData.tokens);
        if (!tokensData) {
            throw createError({
                statusCode: 500,
                statusMessage: "Failed to decrypt tokens",
            });
        }

        const { accessToken } = JSON.parse(tokensData);

        // Use cache for 5 minutes to reduce Discord API calls
        const guilds = await cachedFunction(
            async () => {
                const response = await fetch("https://discord.com/api/v10/users/@me/guilds", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                if (!response.ok) {
                    throw createError({
                        statusCode: response.status,
                        statusMessage: "Failed to fetch guilds from Discord",
                    });
                }

                return await response.json();
            },
            {
                maxAge: 60 * 5, // 5 minutes
                name: `guilds-${sessionData.user.id}`,
                getKey: () => `guilds-${sessionData.user.id}`,
            }
        )();

        // Filter guilds where user has admin permissions
        const adminGuilds = guilds.filter((guild: any) => {
            const permissions = BigInt(guild.permissions);
            const ADMINISTRATOR = BigInt(0x8);
            return (permissions & ADMINISTRATOR) === ADMINISTRATOR || guild.owner;
        });

        return adminGuilds;
    } catch (error) {
        console.error("Guilds fetch error:", error);
        throw createError({
            statusCode: 500,
            statusMessage: "Failed to fetch guilds",
        });
    }
});

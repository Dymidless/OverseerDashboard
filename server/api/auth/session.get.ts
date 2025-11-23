import { decryptData } from "#imports";

export default defineEventHandler(async (event) => {
    const sessionCookie = getCookie(event, "auth_session");

    if (!sessionCookie) {
        return { authenticated: false, user: null };
    }

    try {
        const sessionData = JSON.parse(sessionCookie);

        // Verify expiration
        if (sessionData.expiresAt && Date.now() > sessionData.expiresAt) {
            deleteCookie(event, "auth_session");
            return { authenticated: false, user: null };
        }

        // Return only public user information (no tokens)
        return {
            authenticated: true,
            user: sessionData.user,
        };
    } catch (error) {
        console.error("Session verification error:", error);
        return { authenticated: false, user: null };
    }
});

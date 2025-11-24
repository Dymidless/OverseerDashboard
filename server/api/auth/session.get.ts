const UNAUTHORIZED_STATUS_CODE = 401;

export default defineEventHandler((event) => {
	try {
		const authorizationCookie = getCookie(event, "authorization");
		const sessionData = decryptJWT(authorizationCookie ?? "");

		if (!sessionData) {
			setResponseStatus(event, UNAUTHORIZED_STATUS_CODE);

			return {
				is_authenticated: false,
			};
		}

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

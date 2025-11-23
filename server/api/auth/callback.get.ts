import { exchangeCode } from "../utils/exchangeCode.js";
import { getUserData } from "../utils/getUserData.js";
import { encryptData } from "#imports";

const ONE_SECOND_MILLISECONDS = 1_000;

export default defineEventHandler(async (event) => {
	const { code } = getQuery(event);

	if (typeof code !== "string") {
		return void sendRedirect(event, "/?error=invalid_code");
	}

	try {
		const exchangeCodeData = await exchangeCode(code);

		if (exchangeCodeData === null) {
			return void sendRedirect(event, "/?error=exchange_failed");
		}

		const { access_token, expires_in, refresh_token } = exchangeCodeData;
		const user = await getUserData(access_token);

		if (!user) {
			return void sendRedirect(event, "/?error=user_fetch_failed");
		}

		// Encrypt sensitive tokens
		const encryptedTokens = encryptData(JSON.stringify({
			accessToken,
			refreshToken,
		}));

		// Session data: user (public) + encrypted tokens
		const sessionData = {
			user,
			tokens: encryptedTokens,
			expiresAt: Date.now() + expiresIn * 1000,
		};
		const stringifiedData = JSON.stringify(sessionData);

		// Cookie with httpOnly for security
		// Tokens are encrypted, so even if the cookie is intercepted, they cannot be used
		setCookie(event, "auth_session", JSON.stringify(sessionData), {
			httpOnly: true, // Protection against XSS
			secure: process.env.NODE_ENV === "production", // Only HTTPS in production
			maxAge: expiresIn,
			sameSite: "lax", // Protection against CSRF
			path: "/",
		});

		return void sendRedirect(event, "/dashboard");
	} catch (error) {
		console.error("Authentication Callback Error: ", error);

		return void sendRedirect(event, "/?error=callback_failed");
	}
});

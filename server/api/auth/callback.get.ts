import { exchangeCode } from "../utils/exchangeCode.js";
import { getUserData } from "../utils/getUserData.js";

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

		const { accessToken, refreshToken, expiresIn } = exchangeCodeData;
		const user = await getUserData(accessToken);

		if (!user) {
			return void sendRedirect(event, "/?error=user_fetch_failed");
		}

		const sessionData = {
			user,
			accessToken,
			refreshToken,
			expiresAt: Date.now() + expiresIn * 1000,
		};

		setCookie(event, "auth_session", JSON.stringify(sessionData), {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			maxAge: expiresIn,
			sameSite: "lax",
		});

		return void sendRedirect(event, "/dashboard");
	} catch (error) {
		console.error("Authentication callback error:", error);
		return void sendRedirect(event, "/?error=callback_failed");
	}
});

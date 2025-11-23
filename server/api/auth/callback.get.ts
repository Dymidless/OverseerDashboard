import { exchangeCode } from "../utils/exchangeCode.js";
import { getUserData } from "../utils/getUserData.js";

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

		const { accessToken, expiresIn, refreshToken } = exchangeCodeData;
		const user = await getUserData(accessToken);

		if (!user) {
			return void sendRedirect(event, "/?error=user_fetch_failed");
		}

		const expiresAt = Date.now() + expiresIn * ONE_SECOND_MILLISECONDS;
		const sessionData = {
			access_token: accessToken,
			expires_at: expiresAt,
			refresh_token: refreshToken,
			user,
		};
		const stringifiedData = JSON.stringify(sessionData);

		setCookie(event, "auth_session", stringifiedData, {
			httpOnly: true,
			maxAge: expiresIn,
			sameSite: "lax",
			secure: process.env.NODE_ENV === "production",
		});

		return void sendRedirect(event, "/dashboard");
	} catch (error) {
		console.error("Authentication callback error: ", error);

		return void sendRedirect(event, "/?error=callback_failed");
	}
});

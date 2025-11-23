import { exchangeCode, getUserData } from "#imports";

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

		const expiresAt = Date.now() + expires_in * ONE_SECOND_MILLISECONDS;
		const sessionData = {
			access_token,
			expires_at: expiresAt,
			refresh_token,
			user,
		};
		const stringifiedData = JSON.stringify(sessionData);

		setCookie(event, "auth_session", stringifiedData, {
			httpOnly: true,
			maxAge: expires_in,
			sameSite: "lax",
			secure: process.env.NODE_ENV === "production",
		});

		return void sendRedirect(event, "/dashboard");
	} catch (error) {
		console.error("Authentication Callback Error: ", error);

		return void sendRedirect(event, "/?error=callback_failed");
	}
});

const ONE_SECOND_MILLISECONDS = 1_000;

export default defineEventHandler(async (event) => {
	const { code } = getQuery(event);

	if (typeof code !== "string") {
		return sendRedirect(event, "/?error=invalid_code");
	}

	try {
		const exchangeCodeData = await exchangeCode(code);

		if (exchangeCodeData === null) {
			return sendRedirect(event, "/?error=exchange_failed");
		}

		const { access_token, expires_in, refresh_token } = exchangeCodeData;
		const encryptedAccessToken = encryptData(access_token);
		const encryptedRefreshToken = encryptData(refresh_token);

		const userData = await getUserData(encryptedAccessToken);

		if (!userData) {
			return sendRedirect(event, "/?error=user_fetch_failed");
		}

		const { global_name, id, username } = userData;
		const user: SessionUser = {
			global_name,
			id,
			username,
		};

		const expiresAt = Date.now() + expires_in * ONE_SECOND_MILLISECONDS;
		const sessionData: Session = {
			access_token: encryptedAccessToken,
			expires_at: expiresAt,
			refresh_token: encryptedRefreshToken,
			user,
		};

		const jwtToken = await encryptJWT(sessionData);

		setCookie(event, "authorization", jwtToken, {
			httpOnly: true,
			maxAge: expires_in,
			path: "/",
			sameSite: "lax",
			secure: process.env.NODE_ENV === "production",
		});

		return sendRedirect(event, "/dashboard");
	} catch (error) {
		console.error("Authentication Callback Error: ", error);

		return sendRedirect(event, "/?error=callback_failed");
	}
});

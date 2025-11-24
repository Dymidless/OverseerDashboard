const UNAUTHORIZED_STATUS_CODE = 401;

const eventHandler = defineEventHandler(async (event) => {
	try {
		const authorizationCookie = getCookie(event, "authorization");
		const sessionData = await decryptJWT(authorizationCookie ?? "");

		if (!sessionData) {
			setResponseStatus(event, UNAUTHORIZED_STATUS_CODE);

			return {
				is_authenticated: false,
			} as const;
		}

		const { user } = sessionData;

		return {
			is_authenticated: true,
			user,
		} as const;
	} catch (error) {
		console.error("Session Error: ", error);

		return {
			is_authenticated: false,
		} as const;
	}
});

export default eventHandler;

interface AuthSessionAuthenticatedResponse {
	is_authenticated: true;
	user: SessionUser;
}

interface AuthSessionUnauthenticatedResponse {
	is_authenticated: false;
}

export type AuthSessionResponse = Awaited<ReturnType<typeof eventHandler>>;

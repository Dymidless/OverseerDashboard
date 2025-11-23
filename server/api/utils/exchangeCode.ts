import { createCallbackUrl } from "./createCallbackUrl.js";

const DISCORD_API_BASE_URL = "https://discord.com/api/v10";

export async function exchangeCode(code: string): Promise<{
	accessToken: string;
	expiresIn: number;
	refreshToken: string;
} | null> {
	const init = createInit(code);

	try {
		const request = await fetch(`${DISCORD_API_BASE_URL}/oauth2/token`, init);
		const response = (await request.json()) as DiscordOAuth2TokenResponse | DiscordErrorResponse;

		const { ok, status } = request;

		if (!ok) {
			console.error("Discord OAuth2 token exchange failed:", status, response);
			return null;
		}

		if ("error" in response) {
			console.error("Discord API error:", response.error, response.error_description);
			return null;
		}

		const { access_token: accessToken, expires_in: expiresIn, refresh_token: refreshToken } = response;

		return {
			accessToken,
			expiresIn,
			refreshToken,
		};
	} catch (error) {
		console.error("Token exchange error:", error);
		return null;
	}
}

function createBody(code: string): BodyInit {
	const { clientId, clientSecret, public: _public } = useRuntimeConfig();
	const { baseURL } = _public;

	if (!clientId || !clientSecret) {
		throw new Error("CLIENT_ID or CLIENT_SECRET environment variables are not set");
	}

	const callbackURL = createCallbackUrl(baseURL);

	const params = {
		client_id: clientId,
		client_secret: clientSecret,
		code,
		grant_type: "authorization_code",
		redirect_uri: callbackURL,
		scope: "identify guilds",
	};

	const body = new URLSearchParams(params);
	return body;
}

function createHeaders(): HeadersInit {
	const headers = new Headers({
		"Content-Type": "application/x-www-form-urlencoded",
	});

	return headers;
}

function createInit(code: string): RequestInit {
	const body = createBody(code);
	const headers = createHeaders();

	return {
		body,
		headers,
		method: "POST",
	};
}

export interface DiscordOAuth2TokenResponse {
	expires_in: number;
	access_token: string;
	refresh_token: string;
	scope: string;
	token_type: "Bearer";
}

export interface DiscordErrorResponse {
	error: string;
	error_description?: string;
}

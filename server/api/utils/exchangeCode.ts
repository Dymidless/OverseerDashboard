import { createCallbackUrl } from "./createCallbackUrl.js";

const DISCORD_API_BASE_URL = "https://discord.com/api/v10";

export async function exchangeCode(code: string): Promise<{
	accessToken: string;
	expiresIn: number;
	refreshToken: string;
} | null> {
	const init = createInit(code);

	const request = await fetch(`${DISCORD_API_BASE_URL}/oauth2/token`, init);
	const response = (await request.json()) as DiscordOAuth2TokenResponse;

	const { ok } = request;

	if (!ok) return null;

	const { access_token: accessToken, expires_in: expiresIn, refresh_token: refreshToken } = response;

	return {
		accessToken,
		expiresIn,
		refreshToken,
	};
}

function createBody(code: string): BodyInit {
	const { clientId, clientSecret, public: _public } = useRuntimeConfig();
	const { baseURL } = _public;

	const callbackURL = createCallbackUrl(baseURL);

	const body = new URLSearchParams({
		client_id: clientId,
		client_secret: clientSecret,
		code,
		grant_type: "authorization_code",
		redirect_uri: callbackURL,
		scope: "identify guilds",
	});

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

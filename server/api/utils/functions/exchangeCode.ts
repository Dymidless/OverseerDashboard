import type { RESTPostOAuth2AccessTokenResult } from "discord-api-types/v10";
import { DISCORD_API_BASE_URL } from "../constants.js";
import { createCallbackUrl } from "./createCallbackUrl.js";

export async function exchangeCode(code: string): Promise<RESTPostOAuth2AccessTokenResult | null> {
	const init = createInit(code);

	try {
		const request = await fetch(`${DISCORD_API_BASE_URL}/oauth2/token`, init);
		const response = (await request.json()) as RESTPostOAuth2AccessTokenResult;

		const { ok, status } = request;

		if (!ok) {
			console.error("Discord OAuth2 Token Exchange Failed: ", {
				response,
				status,
			});

			return null;
		}

		if ("error" in response) {
			console.error("Discord API Response Error: ", {
				response,
				status,
			});

			return null;
		}

		return response;
	} catch (error) {
		console.error("Token Exchange Error: ", error);

		return null;
	}
}

function createBody(code: string): BodyInit {
	const { clientId, clientSecret, public: _public } = useRuntimeConfig();
	const { baseURL } = _public;

	if (!(clientId && clientSecret)) {
		throw new Error("Missing CLIENT_ID or CLIENT_SECRET environment variables");
	}

	const callbackUrl = createCallbackUrl(baseURL);
	const params = {
		client_id: clientId,
		client_secret: clientSecret,
		code,
		grant_type: "authorization_code",
		redirect_uri: callbackUrl,
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

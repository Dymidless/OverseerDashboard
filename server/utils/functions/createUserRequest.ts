import { DISCORD_API_BASE_URL } from "../constants.js";

export async function createUserRequest<Result>(
	endpoint: string,
	accessToken: string,
): Promise<CreateUserRequestResult<Result>> {
	try {
		const requestInit = createRequestInit(accessToken);
		const response = await fetch(`${DISCORD_API_BASE_URL}/${endpoint}`, requestInit);
		const { ok } = response;

		if (!ok) {
			return {
				data: null,
				isError: true,
				isRateLimit: false,
			};
		}

		const data = await response.json();

		return {
			data,
			isError: false,
			isRateLimit: false,
		};
	} catch (error) {
		console.log("Discord User Request Error: ", error);

		return {
			data: null,
			isError: true,
			isRateLimit: false,
		};
	}
}

function createRequestHeaders(accessToken: string): HeadersInit {
	const headers = new Headers({
		authorization: `Bearer ${accessToken}`,
		"content-type": "application/json",
	});

	return headers;
}

function createRequestInit(accessToken: string): RequestInit {
	const headers = createRequestHeaders(accessToken);
	const init: RequestInit = {
		headers,
		method: "GET",
	};

	return init;
}

interface CreateUserRequestData<Result> {
	data: Result;
	isError: false;
	isRateLimit: false;
}

interface CreateUserRequestError {
	data: null;
	isError: true;
	isRateLimit: false;
}

interface CreateUserRequestRateLimit {
	data: null;
	isError: false;
	isRateLimit: true;
}

type CreateUserRequestResult<Result> =
	| CreateUserRequestData<Result>
	| CreateUserRequestError
	| CreateUserRequestRateLimit;

import type { RESTGetAPICurrentUserGuildsResult } from "discord-api-types/v10";
import { createUserRequest } from "./createUserRequest.js";

export async function getUserGuilds(accessToken: string): Promise<RESTGetAPICurrentUserGuildsResult> {
	try {
		const { data, isError, isRateLimit } = await createUserRequest<RESTGetAPICurrentUserGuildsResult>(
			"users/@me/guilds",
			accessToken,
		);

		if (isError || isRateLimit) return [];

		return data;
	} catch {
		return [];
	}
}

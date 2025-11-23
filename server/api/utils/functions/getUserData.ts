import type { RESTGetAPIUserResult } from "discord-api-types/v10";
import { createUserRequest } from "./createUserRequest.js";

export async function getUserData(accessToken: string): Promise<RESTGetAPIUserResult | null> {
	try {
		const { data, isError, isRateLimit } = await createUserRequest<RESTGetAPIUserResult>("users/@me", accessToken);

		if (isError || isRateLimit) return null;

		return data;
	} catch {
		return null;
	}
}

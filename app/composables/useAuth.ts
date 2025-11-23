import type { DiscordUser } from "~/shared/types/auth";

interface AuthSession {
	user: DiscordUser;
	accessToken: string;
	refreshToken: string;
	expiresAt: number;
}

export function useAuth() {
	const user = useState<DiscordUser | null>("auth.user", () => null);
	const loading = useState<boolean>("auth.loading", () => false);

	const parseSessionCookie = (): AuthSession | null => {
		if (!process.client) return null;

		try {
			const cookie = useCookie("auth_session");
			if (cookie.value) {
				if (typeof cookie.value === "string") {
					return JSON.parse(cookie.value) as AuthSession;
				}
				return cookie.value as AuthSession;
			}
		} catch (error) {
			// Session cookie parsing failed, return null
		}
		return null;
	};

	const fetchSession = async () => {
		loading.value = true;
		try {
			const session = parseSessionCookie();
			if (session?.user) {
				user.value = session.user;
			}
		} finally {
			loading.value = false;
		}
	};

	const login = () => {
		if (process.client) {
			window.location.href = "/api/auth/login";
		}
	};

	const logout = async () => {
		loading.value = true;
		try {
			await $fetch("/api/auth/logout", { method: "POST" });
			user.value = null;
			const cookie = useCookie("auth_session");
			cookie.value = null;
			await navigateTo("/");
		} finally {
			loading.value = false;
		}
	};

	const isAuthenticated = computed(() => user.value !== null);

	return {
		user: readonly(user),
		loading: readonly(loading),
		isAuthenticated,
		fetchSession,
		login,
		logout,
	};
}

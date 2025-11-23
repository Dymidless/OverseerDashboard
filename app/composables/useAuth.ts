import type { DiscordUser } from "~/shared/types/auth";

interface SessionResponse {
	authenticated: boolean;
	user: DiscordUser | null;
}

export function useAuth() {
	const user = useState<DiscordUser | null>("auth.user", () => null);
	const loading = useState<boolean>("auth.loading", () => false);

	const fetchSession = async () => {
		loading.value = true;
		try {
			const session = await $fetch<SessionResponse>("/api/auth/session");
			if (session.authenticated && session.user) {
				user.value = session.user;
			} else {
				user.value = null;
			}
		} catch (error) {
			user.value = null;
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

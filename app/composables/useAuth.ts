import type { AuthSessionResponse } from "~~/server/api/auth/session.get";

export function useAuth() {
	const user = useState<SessionUser | null>("auth.user", () => null);
	const loading = useState<boolean>("auth.loading", () => false);

	const fetchSession = async () => {
		loading.value = true;

		try {
			const session = await $fetch<AuthSessionResponse>("/api/auth/session");

			if (session.is_authenticated && session.user) {
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

	const login = () => navigateTo("/api/auth/login");
	const logout = async () => navigateTo("/api/auth/logout");

	const isAuthenticated = computed(() => user.value !== null);

	return {
		fetchSession,
		isAuthenticated,
		loading: readonly(loading),
		login,
		logout,
		user: readonly(user),
	};
}

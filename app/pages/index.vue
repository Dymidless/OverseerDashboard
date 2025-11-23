<script lang="ts" setup>
let user = ref<any>(null);
let isAuthenticated = ref(false);

const login = () => {
	window.location.href = "/api/auth/login";
};

const logout = async () => {
	try {
		await $fetch("/api/auth/logout", { method: "POST" });
		user.value = null;
		isAuthenticated.value = false;
		const cookie = useCookie("auth_session");
		cookie.value = null;
		await navigateTo("/");
	} catch (error) {
		// Logout failed, but continue anyway
	}
};

onMounted(() => {
	try {
		const cookie = useCookie("auth_session");
		if (cookie.value) {
			if (typeof cookie.value === "string") {
				const session = JSON.parse(cookie.value);
				user.value = session.user;
				isAuthenticated.value = true;
			}
		}
	} catch (error) {
		// Session parsing failed
	}
});
</script>

<template>
	<main class="flex justify-center items-center w-full h-dvh">
		<div class="flex flex-col gap-4 p-8 rounded-lg border min-w-100 border-neutral-800 bg-neutral-900">
			<h1 class="text-3xl font-extrabold text-center">Overseer</h1>
			<UiSeparator />
			<div class="flex flex-col gap-4">
				<div v-if="isAuthenticated" class="flex flex-col gap-4">
					<div class="text-center text-sm text-neutral-400">
						Logged as <span class="text-white font-semibold">{{ user?.username }}</span>
					</div>
					<UiButton href="/dashboard" is="a" variant="secondary">Go to Dashboard</UiButton>
					<UiButton @click="logout" variant="destructive">Logout</UiButton>
				</div>
				<div v-else class="flex flex-col gap-4">
					<UiButton @click="login" variant="default">Login with Discord</UiButton>
				</div>
			</div>
		</div>
	</main>
</template>

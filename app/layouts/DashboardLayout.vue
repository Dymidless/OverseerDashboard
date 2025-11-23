<script lang="ts" setup>
	definePageMeta({
		middleware: "auth",
		validate: (route) => {
			const { params } = route;
			const { guildId } = params ?? {};

			return Boolean(guildId);
		},
	});
</script>

<template>
	<div class="flex w-full min-h-screen bg-neutral-950">
		<SidebarRoot class="border-r border-neutral-800" />
		<main class="flex-1 min-w-0 overflow-x-hidden">
			<slot/>
		</main>
	</div>
</template>

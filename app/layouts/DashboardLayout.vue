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
	<div class="flex justify-center h-full">
		<div class="flex gap-10 w-full max-w-7xl h-full">
			<SidebarRoot/>
			<div class="mt-4 mb-4 w-full">
				<main class="p-6 h-full rounded-lg border border-neutral-800 bg-neutral-900">
					<slot/>
				</main>
			</div>
		</div>
	</div>
</template>

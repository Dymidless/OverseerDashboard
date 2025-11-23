<script lang="ts" setup>
	import { Crown, Home, SquareCode } from "lucide-vue-next";

	const SIDEBAR_GROUPS: SidebarGroup[] = [
		{
			items: [
				{
					icon: Home,
					name: "Dashboard",
				},
				{
					icon: Crown,
					name: "Premium",
				},
			],
			name: "General",
		},
		{
			items: [
				{
					icon: SquareCode,
					name: "Automations",
				},
			],
			name: "Management",
		},
	];
</script>

<template>
	<section class="flex flex-col gap-4">
		<SidebarGroup v-for="group in SIDEBAR_GROUPS" :group="group" :key="group.name"/>
	</section>
</template>

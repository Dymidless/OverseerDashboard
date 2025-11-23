<script lang="ts" setup>
	const { group } = defineProps<SidebarGroupComponentProps>();
	const { items, name } = group;

	interface SidebarGroupComponentProps {
		group: SidebarGroup;
	}
</script>

<template>
	<UiCollapsibleRoot open>
		<UiCollapsibleTrigger
			class="w-full text-xs font-extrabold uppercase transition-opacity hover:opacity-75 text-start"
		>
			{{ name }}
		</UiCollapsibleTrigger>
		<UiCollapsibleContent class="flex flex-col gap-2">
			<SidebarPlugin v-for="item in items" :item="item" :key="item.name"/>
		</UiCollapsibleContent>
	</UiCollapsibleRoot>
</template>

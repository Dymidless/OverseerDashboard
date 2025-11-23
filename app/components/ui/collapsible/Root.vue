<script lang="ts" setup>
	const { open: _open } = defineProps<CollapsibleRootComponentProps>();
	const open = ref(_open);

	provide("collapsibleOpen", open);
	provide("toggleCollapsible", () => {
		open.value = !open.value;
	});

	interface CollapsibleRootComponentProps {
		open?: boolean;
	}
</script>

<template>
	<div class="flex flex-col gap-2">
		<slot/>
	</div>
</template>

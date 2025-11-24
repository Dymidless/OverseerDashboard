<script lang="ts" setup>
	import { tv, type VariantProps } from "tailwind-variants";

	const { orientation } = defineProps<SeparatorComponentProps>();
	const separator = tv({
		base: "bg-neutral-800",
		defaultVariants: {
			orientation: "horizontal",
		},
		variants: {
			orientation: {
				horizontal: "h-px w-full",
				vertical: "h-full w-px",
			},
		},
	});

	interface SeparatorComponentProps {
		orientation?: SeparatorOrientation;
	}

	type SeparatorVariantProps = VariantProps<typeof separator>;
	type SeparatorOrientation = SeparatorVariantProps["orientation"];
</script>

<template>
	<div :class="separator({ orientation })"/>
</template>

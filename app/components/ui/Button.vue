<script lang="ts" setup>
	import { twMerge } from "tailwind-merge";
	import { tv, type VariantProps } from "tailwind-variants";

	const { variant, is } = defineProps<ButtonComponentProps>();
	const button = tv({
		base: "px-4 py-2 h-10 rounded-lg inline-flex items-center justify-center cursor-pointer transition-all gap-2 text-sm disabled:opacity-50 disabled:pointer-events-none [&>svg]:size-5 w-full",
		defaultVariants: {
			variant: "primary",
		},
		variants: {
			variant: {
				destructive: "bg-neutral-800 text-rose-400 border border-neutral-700 hover:opacity-75",
				ghost: "bg-transparent text-neutral-50 hover:bg-neutral-800",
				link: "hover:underline",
				primary: "bg-neutral-50 hover:opacity-80 text-neutral-950",
				secondary: "bg-neutral-800 border border-neutral-700 hover:opacity-75",
			},
		},
	});

	interface ButtonComponentProps {
		variant?: ButtonVariant;
		is?: ButtonIs;
	}

	type ButtonIs = keyof HTMLElementTagNameMap;

	type ButtonVariantProps = VariantProps<typeof button>;
	type ButtonVariant = ButtonVariantProps["variant"];
</script>

<template>
	<component :class="twMerge(button({ variant }))" :is="is ?? 'button'">
		<slot/>
	</component>
</template>

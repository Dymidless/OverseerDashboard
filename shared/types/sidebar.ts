import type { Component } from "vue";

export interface SidebarGroup {
	items: SidebarGroupItem[];
	name: string;
}

export interface SidebarGroupItem {
	icon: Component;
	name: string;
}

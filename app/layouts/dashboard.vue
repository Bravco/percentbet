<template>
    <UDashboardGroup>
        <UDashboardSidebar
            v-model:open="open"
            class="bg-elevated/25"
            :ui="{ header: 'lg:border-b lg:border-default', footer: 'lg:border-t lg:border-default' }"
            collapsible
            resizable
        >
            <template #header="{ collapsed }">
                <UButton v-if="collapsed" to="/" icon="i-lucide-percent" variant="ghost"/>
                <Logo v-else/>
            </template>
            <template #default="{ collapsed }">
                <UNavigationMenu
                    :items="links[0]"
                    :collapsed="collapsed"
                    orientation="vertical"
                    tooltip
                    popover
                />
                <UNavigationMenu
                    :collapsed="collapsed"
                    :items="links[1]"
                    orientation="vertical"
                    tooltip
                    class="mt-auto"
                />
                <USeparator/>
                <UColorModeButton v-if="collapsed" class="text-dimmed hover:text-highlighted cursor-pointer"/>
                <UColorModeSelect v-else class="text-muted hover:text-highlighted"/>
            </template>
            <template #footer="{ collapsed }">
                <UDropdownMenu :items="items" :ui="{ content: 'min-w-(--reka-dropdown-menu-trigger-width)' }">
                    <UButton
                        :avatar="avatar"
                        color="neutral"
                        variant="ghost"
                        :square="collapsed"
                        class="data-[state=open]:bg-elevated w-full"
                        :class="{ 'p-0': collapsed }"
                    >
                        <template #default v-if="!collapsed">
                            <div class="flex flex-col items-start truncate">
                                <span>Your username</span>
                                <span class="text-muted text-xs">example@example.com</span>
                            </div>
                        </template>
                    </UButton>
                    <template #content-top>
                        <div class="w-full flex items-center font-semibold p-2.5 text-sm gap-1.5 border-b border-muted">
                            <UAvatar v-bind="avatar"/>
                            <div class="flex flex-col items-start">
                                <span>Your username</span>
                                <span class="text-muted text-xs truncate">example@example.com</span>
                            </div>
                        </div>
                    </template>
                </UDropdownMenu>
            </template>
        </UDashboardSidebar>
        <slot/>
    </UDashboardGroup>
</template>

<script lang="ts" setup>
    import type { NavigationMenuItem, DropdownMenuItem, AvatarProps } from "@nuxt/ui";

    const open = ref<boolean>(false);

    const links = [
        [{
            label: "App",
            icon: "i-lucide-bot",
            to: "/app",
            onSelect: () => open.value = false
        }, {
            label: "Settings",
            icon: "i-lucide-settings",
            to: "/settings",
            defaultOpen: true,
            type: "trigger",
            children: [{
                label: "General",
                to: "/settings",
                exact: true,
                onSelect: () => open.value = false
            }, {
                label: "Billing",
                to: "/settings/billing",
                onSelect: () => open.value = false
            }, {
                label: "Privacy",
                to: "/settings/privacy",
                onSelect: () => open.value = false
            }]
        }],
        [{
            label: "Twitter",
            icon: "i-lucide-twitter",
            to: "https://x.com/PercentBet",
            target: "_blank"
        }, {
            label: "Help & Support",
            icon: "i-lucide-info",
            to: "",
            target:"_blank"
        }]
    ] satisfies NavigationMenuItem[][];

    const avatar = computed<AvatarProps>(() => ({
        icon: "i-lucide-user",
        size: "md",
        class: "bg-accented"
    }));

    const items = computed<DropdownMenuItem[]>(() => ([{
        label: "Log out",
        icon: "i-lucide-log-out"
    }]));
</script>
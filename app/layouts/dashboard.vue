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
                <UIcon v-if="collapsed" name="i-lucide-percent" class="mx-auto size-5 text-primary"/>
                <h1 v-else class="text-xl text-highlighted font-bold"><span class="text-primary">%</span>bet</h1>
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
                <UColorModeButton v-if="collapsed" class="text-dimmed hover:text-highlighted"/>
                <UColorModeSelect v-else class="text-muted hover:text-highlighted"/>
            </template>
            <template #footer="{ collapsed }">
                <UDropdownMenu
                    :items="items"
                    :content="{ align: 'center', collisionPadding: 12 }"
                    :ui="{ content: collapsed ? 'w-48' : 'w-(--reka-dropdown-menu-trigger-width)' }"
                >
                    <UButton
                        :label="collapsed ? undefined : 'Your username'"
                        icon="i-lucide-circle-user"
                        color="neutral"
                        variant="ghost"
                        :square="collapsed"
                        class="data-[state=open]:bg-elevated"
                    />
                </UDropdownMenu>
            </template>
        </UDashboardSidebar>
        <slot/>
    </UDashboardGroup>
</template>

<script lang="ts" setup>
    import type { NavigationMenuItem, DropdownMenuItem } from "@nuxt/ui";

    const open = ref<boolean>(false);

    const links = [
        [{
            label: "Home",
            icon: "i-lucide-house",
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
            label: "Feedback",
            icon: "i-lucide-message-circle",
            to: "",
            target: "_blank"
        }, {
            label: "Help & Support",
            icon: "i-lucide-info",
            to: "",
            target:"_blank"
        }]
    ] satisfies NavigationMenuItem[][];

    const items = computed<DropdownMenuItem[]>(() => ([
        [{
            type: "label",
            label: "Your username",
            icon: "i-lucide-circle-user"
            //avatar: user.value.avatar
        }],
        [{
            label: "Log out",
            icon: "i-lucide-log-out"
        }]
    ]));
</script>
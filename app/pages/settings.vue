<template>
    <UDashboardPanel id="settings" :ui="{ body: 'lg:py-12' }">
        <template #header>
            <UDashboardNavbar title="Settings">
                <template #leading>
                    <UDashboardSidebarCollapse/>
                </template>
            </UDashboardNavbar>
            <UDashboardToolbar>
                <UNavigationMenu :items="links" highlight class="-mx-1 flex-1"/>
            </UDashboardToolbar>
        </template>
        <template #body>
            <div class="flex flex-col gap-4 sm:gap-6 lg:gap-12 w-full lg:max-w-2xl mx-auto">
                <NuxtPage/>
            </div>
        </template>
    </UDashboardPanel>
</template>

<script lang="ts" setup>
    import type { NavigationMenuItem } from "@nuxt/ui";

    definePageMeta({ layout: "dashboard" });

    const links = [{
        label: "General",
        icon: "i-lucide-user",
        to: "/settings",
        exact: true
    }, {
        label: "Billing",
        icon: "i-lucide-dollar-sign",
        to: "/settings/billing"
    }, {
        label: "Privacy",
        icon: "i-lucide-shield",
        to: "/settings/privacy"
    }] satisfies NavigationMenuItem[];
</script>
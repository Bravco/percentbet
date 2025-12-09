<template>
    <div>
        <UHeader :ui="{ body: 'h-full' }">
            <template #title>
                <h1><span class="text-primary">%</span>bet</h1>
            </template>
            
            <UNavigationMenu :items="items" variant="link"/>

            <template #right>
                <UButton label="Sign in" :to="{ path: '/', hash: '#waitlist' }"/>
            </template>

            <template #body>
                <div class="h-full flex flex-col justify-between">
                    <UNavigationMenu :items="items" orientation="vertical" variant="link" class="-mx-2.5"/>
                    <div class="flex gap-x-1.5 -ml-1.5">
                        <UButton icon="i-lucide-twitter" variant="ghost" color="neutral" target="_blank" to="https://x.com"/>
                        <UButton icon="i-lucide-instagram" variant="ghost" color="neutral" target="_blank" to="https://instagram.com"/>
                        <UButton icon="i-lucide-youtube" variant="ghost" color="neutral" target="_blank" to="https://youtube.com"/>
                        <UColorModeButton class="cursor-pointer"/>
                    </div>
                </div>
            </template>
        </UHeader>

        <UMain>
            <slot/>
        </UMain>

        <USeparator/>

        <UFooter>
            <template #top>
                <UContainer>
                    <UFooterColumns :columns="columns">
                        <template #right>
                            <UFormField name="email" label="Subscribe to our newsletter" description="Stay updated on new releases, features and discounts." size="lg">
                                <UInput type="email" placeholder="your@email.com" class="w-full">
                                    <template #trailing>
                                        <UButton type="submit" size="xs" color="neutral" label="Subscribe" class="cursor-pointer"/>
                                    </template>
                                </UInput>
                            </UFormField>
                        </template>
                    </UFooterColumns>
                </UContainer>
            </template>

            <template #left>
                <p class="text-muted text-sm">Copyright © 2025</p>
            </template>

            <template #right>
                <UButton icon="i-lucide-twitter" variant="ghost" color="neutral" target="_blank" to="https://x.com"/>
                <UButton icon="i-lucide-instagram" variant="ghost" color="neutral" target="_blank" to="https://instagram.com"/>
                <UButton icon="i-lucide-youtube" variant="ghost" color="neutral" target="_blank" to="https://youtube.com"/>
                <UColorModeButton class="cursor-pointer"/>
            </template>
        </UFooter>
    </div>
</template>

<script setup lang="ts">
    import type { NavigationMenuItem } from "@nuxt/ui";
    import type { FooterColumn } from "@nuxt/ui";

    const items = ref<NavigationMenuItem[]>([
        {
            label: "How it works",
            to: "#how-it-works"
        },
        {
            label: "About",
            to: "#about"
        },
        {
            label: "Pricing",
            to: "#pricing",
        },
        {
            label: "FAQ",
            to: "#faq"
        }
    ]);

    const columns: FooterColumn[] = [
        {
            label: "Navigation",
            children: [
                {
                    label: "How it works",
                    to: "#how-it-works"
                },
                {
                    label: "About",
                    to: "#about"
                },
                {
                    label: "Pricing",
                    to: "#pricing",
                },
                {
                    label: "FAQ",
                    to: "#faq"
                }
            ]
        },
        {
            label: "Legal",
            children: [
                {
                    label: "Terms of Use",
                    to: ""
                },
                {
                    label: "Privacy Policy",
                    to: ""
                }
            ]
        },
        {
            label: "Socials",
            children: [
                {
                    label: "Twitter",
                    to: "https://x.com",
                    target: "_blank"
                },
                {
                    label: "Instagram",
                    to: "https://instagram.com",
                    target: "_blank"
                },
                {
                    label: "YouTube",
                    to: "https://youtube.com",
                    target: "_blank"
                }
            ]
        },
        {
            label: "Contact",
            children: [
                {
                    label: "support@percentbet.com",
                    to: "mailto:support@pakt.com"
                }
            ]
        }
    ];
</script>
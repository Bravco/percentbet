<template>
    <div>
        <UHeader :ui="{ body: 'h-full' }">
            <template #title>
                <Logo/>
            </template>
            
            <UNavigationMenu :items="items" variant="link"/>

            <template #right>
                <UButton label="Sign in" :to="{ path: '/', hash: '#waitlist' }"/>
            </template>

            <template #body>
                <div class="h-full flex flex-col justify-between">
                    <UNavigationMenu :items="items" orientation="vertical" variant="link" class="-mx-2.5"/>
                    <div class="flex gap-x-1.5 -ml-1.5">
                        <UButton icon="i-lucide-twitter" variant="ghost" color="neutral" target="_blank" to="https://x.com/PercentBet"/>
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
                            <UForm :schema="schema" :state="state" @submit="onSubmit">
                                <UFormField name="email" label="Subscribe to our newsletter" description="Stay updated on new releases, features and discounts." size="lg" required>
                                    <UInput v-model="state.email" type="email" placeholder="your@email.com" class="w-full">
                                        <template #trailing>
                                            <UButton
                                                type="submit"
                                                size="xs"
                                                color="neutral"
                                                label="Subscribe"
                                                :disabled="loading"
                                                :loading="loading"
                                                class="cursor-pointer"
                                            />
                                        </template>
                                    </UInput>
                                </UFormField>
                            </UForm>
                        </template>
                    </UFooterColumns>
                </UContainer>
            </template>

            <template #left>
                <p class="text-muted text-sm">&copy; {{ (new Date).getFullYear() }} PercentBet | All rights reserved.</p>
            </template>

            <template #right>
                <UButton icon="i-lucide-twitter" variant="ghost" color="neutral" target="_blank" to="https://x.com/PercentBet"/>
                <UColorModeButton class="cursor-pointer"/>
            </template>
        </UFooter>
    </div>
</template>

<script setup lang="ts">
    import * as v from "valibot";
    import type { FormSubmitEvent } from "@nuxt/ui";
    import type { NavigationMenuItem } from "@nuxt/ui";
    import type { FooterColumn } from "@nuxt/ui";

    const config = useRuntimeConfig();
    const toast = useToast();

    const schema = v.object({
        email: v.pipe(v.string(), v.email(""))
    });

    type Schema = v.InferOutput<typeof schema>;

    const state = reactive({ email: "" });
    const loading = ref<boolean>(false);

    const items = ref<NavigationMenuItem[]>([
        {
            label: "How it works",
            to: { path: "/", hash: "#how-it-works" },
            active: false
        },
        {
            label: "About",
            to: { path: "/", hash: "#about" },
            active: false
        },
        {
            label: "Pricing",
            to: { path: "/", hash: "#pricing" },
            active: false
        },
        {
            label: "FAQ",
            to: { path: "/", hash: "#faq" },
            active: false
        }
    ]);

    const columns: FooterColumn[] = [
        {
            label: "Navigation",
            children: [
                {
                    label: "How it works",
                    to: { path: "/", hash: "#how-it-works" },
                    active: false
                },
                {
                    label: "About",
                    to: { path: "/", hash: "#about" },
                    active: false
                },
                {
                    label: "Pricing",
                    to: { path: "/", hash: "#pricing" },
                    active: false
                },
                {
                    label: "FAQ",
                    to: { path: "/", hash: "#faq" },
                    active: false
                }
            ]
        },
        {
            label: "Legal",
            children: [
                {
                    label: "Terms of Service"
                },
                {
                    label: "Privacy Policy"
                }
            ]
        },
        {
            label: "Socials",
            children: [
                {
                    label: "Twitter",
                    to: "https://x.com/PercentBet",
                    target: "_blank"
                }
            ]
        },
        {
            label: "Help & Support",
            children: [
                {
                    label: "support@percentbet.com",
                    to: "mailto:support@pakt.com",
                    target: "_blank"
                }
            ]
        }
    ];

    async function onSubmit(event: FormSubmitEvent<Schema>) {
        loading.value = true;

        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                access_key: config.public.WEB3FORMS_ACCESS_KEY,
                from_name: "percentbet.com",
                subject: "Newsletter",
                email: event.data.email,
            })
        });

        const result = await response.json();

        if (result.success) {
            toast.add({ title: "You successfully subscribed to the newsletter.", color: "success" });
            loading.value = false;
        }
    }
</script>
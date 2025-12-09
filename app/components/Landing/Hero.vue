<template>
    <UPageHero :links="links">
        <template #headline>
            <UBadge
                label="New"
                variant="soft"
                color="secondary"
            />
            <UButton
                label="Releasing in early 2026"
                trailing-icon="i-lucide-arrow-right"
                size="md"
                variant="link"
                color="neutral"
                class="underline underline-offset-2 cursor-pointer"
                :to="{ path: '/', hash: '#waitlist' }"
            />
        </template>
        <template #title>
            Take <span class="text-primary">calculated</span> risk
        </template>
        <template #description>
            <p>
                Turn uncertainty into opportunity.<br>
                AI-powered insights that help you increase your edge within the prediction markets.
            </p>
        </template>
        <template #default>
            <Placeholder class="h-150"/>
        </template>
    </UPageHero>
</template>

<script setup lang="ts">
    import type { ButtonProps } from "@nuxt/ui";

    const links = ref<ButtonProps[]>([
        {
            label: "Get started - for free",
            to: { path: "/", hash: "#waitlist" },
            trailingIcon: "i-lucide-arrow-right",
            size: "lg"
        }
    ]);
</script>
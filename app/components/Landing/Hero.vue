<template>
    <UPageHero :links="links" class="bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--ui-primary)_10%,transparent)_0%,transparent_70%)]">
        <template #headline>
            <UBadge
                label="New"
                variant="soft"
                color="secondary"
            />
            <UButton
                label="Releasing in January 2026"
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
                Spots mispriced prediction markets to give you an edge.<br>
                Turning uncertainty into opportunity.
            </p>
        </template>
        <template #default>
            <UColorModeImage
                light="/images/hero-light.webp"
                dark="/images/hero-dark.webp"
                alt="hero-image"
                class="w-full aspect-video object-cover object-top mask-b-from-70% rounded-md border border-dashed border-accented"
            />
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
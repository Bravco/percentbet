<template>
    <UPageHero :links="links" class="bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--ui-primary)_10%,transparent)_0%,transparent_70%)]">
        <template #headline>
            <UBadge
                label="Released on January 1st, 2026"
                variant="soft"
                color="secondary"
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
            to: "/auth",
            trailingIcon: "i-lucide-arrow-right",
            size: "lg"
        }
    ]);
</script>
<template>
    <div
        class="w-full h-full flex flex-col items-center justify-center text-center px-2.5 py-5 rounded-md ring-2 ring-inset"
        :class="bgClasses"
    >
        <UIcon v-if="icon" :name="icon" class="size-6"/>
        <span class="text-lg font-medium">{{ value }}</span>
        <span class="text-xs">{{ label }}</span>
    </div>
</template>

<script lang="ts" setup>
    const props = defineProps<{
        label: string,
        value: string,
        icon?: string | undefined,
        color?: "neutral" | "primary" | "success" | "secondary" | "tertiary"
    }>();

    const bgClasses = computed(() => {
        if (props.color === "primary") return "bg-primary/10 text-primary ring-primary/25";
        if (props.color === "success") return "bg-success/10 text-success ring-success/25";
        if (props.color === "secondary") return "bg-secondary/10 text-secondary ring-secondary/25";
        if (props.color === "tertiary") return "bg-tertiary/10 text-tertiary ring-tertiary/25";
        return "bg-elevated ring-accented";
    });
</script>
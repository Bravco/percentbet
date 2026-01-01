<template>
    <UPageBody>
        <UContainer>
            <ContentRenderer v-if="data" :value="data"/>
            <div v-else>Not found</div>
        </UContainer>
    </UPageBody>
</template>

<script lang="ts" setup>
    definePageMeta({ layout: "landing" });

    const route = useRoute();
    const { data } = await useAsyncData(() => queryCollection("content").path(route.path).first());
</script>
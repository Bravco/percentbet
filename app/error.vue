<template>
    <UError :error="error"/>
</template>

<script setup lang="ts">
    const error = useError();
</script>
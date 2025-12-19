<template>
    <NuxtRouteAnnouncer/>
    <UApp>
        <NuxtLayout>
            <NuxtPage/>
        </NuxtLayout>
    </UApp>
</template>

<script lang="ts" setup>
    const router = useRouter();
    const route = useRoute();
    const user = useCurrentUser();

    onMounted(() => {
        watch(user, (currentUser, prevUser) => {
            if (prevUser && !currentUser) {
                return router.replace("/auth");
            }
            
            if (currentUser && route.name === "auth") {
                return router.replace("/app");
            }
        });
    });
</script>
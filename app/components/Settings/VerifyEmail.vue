<template>
    <UPageCard
        title="Verify Email"
        description="Please verify your email address to keep your account safe."
        variant="subtle"
    >
        <UButton
            @click="sendVerificationEmail"
            :label="user?.emailVerified ? 'Verified' : 'Send verification email'"
            :disabled="user?.emailVerified"
            :color="user?.emailVerified ? 'success' : 'primary'"
            :trailing-icon="user?.emailVerified ? 'i-lucide-check' : undefined"
            class="w-fit cursor-pointer"
        />
    </UPageCard>
</template>

<script lang="ts" setup>
    import { sendEmailVerification } from "firebase/auth";

    const user = useCurrentUser();

    function sendVerificationEmail() {
        if (!user.value) return;
        sendEmailVerification(user.value);
    }
</script>
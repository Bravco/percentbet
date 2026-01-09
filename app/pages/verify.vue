<template>
    <div class="grid place-items-center py-16 sm:py-24 lg:py-32 px-4">
        <UPageCard class="w-full max-w-md space-y-4">
            <div class="flex items-center gap-2">
                <UButton
                    @click=""
                    icon="i-lucide-arrow-left"
                    color="neutral"
                    variant="ghost"
                    class="cursor-pointer"
                    square
                />
                <h2 class="text-base text-pretty font-semibold text-highlighted">Verify Email</h2>
            </div>
            <p>
                We've sent you an email to verify your email address
                <span class="font-medium">{{ user?.email }}</span>
            </p>
            <UButton
                @click="resend"
                :disabled="cooldown > 0"
                :label="cooldown === 0 ? 'Resend Verification Email' : `Resend in ${cooldown}`"
                class="w-fit cursor-pointer"
            />
        </UPageCard>
    </div>
</template>

<script lang="ts" setup>
    import { sendEmailVerification } from "firebase/auth";

    const auth = useFirebaseAuth();
    const user = useCurrentUser();
    const toast = useToast();

    const cooldown = ref(0);
    let interval: ReturnType<typeof setInterval> | null = null;
    let verifyInterval: ReturnType<typeof setInterval> | null = null;

    const startCooldown = () => {
        cooldown.value = 60;
        interval = setInterval(() => {
            cooldown.value--;
            if (cooldown.value <= 0 && interval) {
                clearInterval(interval);
                interval = null;
            }
        }, 1000);
    };

    const resend = async () => {
        if (!auth?.currentUser || cooldown.value > 0) return;
        await sendEmailVerification(auth.currentUser);
        toast.add({ title: "Verify Email", description: "We have resent you the verification email.", color: "success" });
        startCooldown();
    };

    const startVerificationCheck = () => {
        verifyInterval = setInterval(async () => {
            if (!user.value) return;
            await user.value.reload();
            if (user.value.emailVerified) {
                clearInterval(verifyInterval!);
                navigateTo("/app");
            }
        }, 3000);
    };

    onMounted(() => {
        startVerificationCheck();
    });

    onUnmounted(() => {
        if (interval) clearInterval(interval);
        if (verifyInterval) clearInterval(verifyInterval);
    });
</script>
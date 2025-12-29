<template>
    <UForm>
        <UPageCard
            title="Profile"
            description="Your information wont be shared publicly."
            variant="naked"
            orientation="horizontal"
            class="mb-4"
        />
        <UPageCard variant="subtle">
            <UFormField
                name="name"
                label="Display Name"
                description="Will appear on receipts, invoices, and other communication."
                class="flex max-sm:flex-col justify-between items-start gap-4"
            >
                <UInput :placeholder="user?.displayName ?? undefined" readonly disabled/>
            </UFormField>
            <USeparator/>
            <UFormField
                name="email"
                label="Email"
                description="Used to sign in, for email receipts and product updates."
                class="flex max-sm:flex-col justify-between items-start gap-4"
            >
                <UInput :placeholder="user?.email ?? undefined" type="email" readonly disabled/>
            </UFormField>
        </UPageCard>
    </UForm>
</template>

<script lang="ts" setup>
    const user = useCurrentUser();
</script>
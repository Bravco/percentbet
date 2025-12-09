<template>
    <UPageSection id="waitlist">
        <UPageCTA
            description="Get latest updates on %bet and be the first one to try it out!"
            variant="subtle"
        >
            <template #title>
                <div class="mb-3 text-base text-secondary font-semibold">Early 2026</div>
                Join the waitlist
            </template>
            <template #links>
                <UForm :schema="schema" :state="state" @submit="onSubmit" class="flex flex-wrap gap-4">
                    <UFormField name="email" size="lg" required>
                        <UInput v-model="state.email" type="email" placeholder="your@email.com"/>
                    </UFormField>
                    <UButton
                        type="submit"
                        class="cursor-pointer"
                        :disabled="loading"
                        :icon="loading ? 'i-eos-icons-loading' : ''"
                        :label="loading ? '' : 'Submit'"
                    />
                </UForm>
            </template>
        </UPageCTA>
    </UPageSection>
</template>

<script lang="ts" setup>
    import * as v from "valibot";
    import type { FormSubmitEvent } from "@nuxt/ui";

    const config = useRuntimeConfig();
    const toast = useToast();

    const schema = v.object({
        email: v.pipe(v.string(), v.email(""))
    });

    type Schema = v.InferOutput<typeof schema>;

    const state = reactive({ email: "" });
    const loading = ref<boolean>(false);

    async function onSubmit(event: FormSubmitEvent<Schema>) {
        loading.value = true;

        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                access_key: config.public.WEB3FORMS_ACCESS_KEY,
                from_name: "percentbet.com",
                subject: "Waitlist",
                email: event.data.email,
            })
        });

        const result = await response.json();

        if (result.success) {
            toast.add({ title: "You were successfully added to the waitlist.", color: "success" });
            loading.value = false;
        }
    }
</script>
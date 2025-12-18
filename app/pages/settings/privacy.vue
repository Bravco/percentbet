<template>
    <UPageCard
        title="Password"
        description="Confirm your current password before setting a new one."
        variant="subtle"
    >
        <UForm @submit="onSubmit" :schema="schema" :state="state" class="max-w-xs flex flex-col gap-4">
            <UFormField name="current">
                <UInput v-model="state.current" type="password" required placeholder="Current password" class="w-full"/>
            </UFormField>
            <UFormField name="new">
                <UInput v-model="state.new" type="password" required placeholder="New password" class="w-full"/>
            </UFormField>
            <UButton type="submit" label="Confirm" class="w-fit cursor-pointer"/>
        </UForm>
    </UPageCard>
    <UPageCard
        title="Danger Zone"
        description="You can delete your account here. This action is not reversible. All information related to this account will be deleted permanently without refunds."
        class="ring-error bg-error/5"
    >
        <template #footer>
            <UButton label="Delete account" color="error"/>
        </template>
    </UPageCard>
</template>

<script lang="ts" setup>
    import * as v from "valibot";
    import type { FormSubmitEvent } from "@nuxt/ui";

    const toast = useToast();

    const schema = v.pipe(
        v.object({
            current: v.pipe(v.string()),
            new: v.pipe(v.string(), v.minLength(8, "Your password must have 8 characters or more."))
        }),
        v.forward(v.partialCheck(
            [["current"], ["new"]],
            (input) => input.current !== input.new,
            "Passwords must be different."
        ), ["new"])
    );

    type Schema = v.InferOutput<typeof schema>;

    const state = reactive({ current: "", new: "" });

    async function onSubmit(event: FormSubmitEvent<Schema>) {
        toast.add({ title: "Password changed", description: "You successfully changed your password.", color: "success" });
        toast.add({ title: "Something went wrong", description: "We could not change your password.", color: "error" });
        console.log(event.data);
    }
</script>
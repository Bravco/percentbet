<template>
    <UPageCard
        title="Change Password"
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
</template>

<script lang="ts" setup>
    import * as v from "valibot";
    import type { FormSubmitEvent } from "@nuxt/ui";
    import { signInWithEmailAndPassword, updatePassword } from "firebase/auth";
    
    const auth = useFirebaseAuth();
    const user = useCurrentUser();
    const toast = useToast();

    const schema = v.pipe(
        v.object({
            current: v.pipe(v.string()),
            new: v.pipe(v.string(), v.minLength(8, "Your new password must have 8 characters or more."))
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
        if (!auth || !user.value || !user.value.email) return;

        signInWithEmailAndPassword(auth, user.value.email, event.data.current)
            .then(() => {
                if (!user.value) return;
                updatePassword(user.value, event.data.new)
                    .then(() => {
                        toast.add({ title: "Password Changed", description: "You successfully changed your password.", color: "success" });
                    })
                    .catch(() => {
                        toast.add({ title: "Something went wrong!", description: "We could not change your password.", color: "error" });
                    });
            })
            .catch(() => {
                toast.add({ title: "Incorrect Password", description: "You did not provide your current password correctly.", color: "error" });
            });
    }
</script>
<template>
    <UPageCard
        title="Danger Zone"
        description="You can delete your account here. This action is not reversible. All information related to this account will be deleted permanently without refunds."
        class="ring-error bg-error/5"
    >
        <template #footer>
            <UModal
                v-model:open="open"
                title="Delete Account"
                description="Are you sure you want to permanently and irreversibly delete your account and all your data without refunds?"
            >
                <UButton label="Delete account" color="error" class="cursor-pointer"/>
                <template #body>
                    <UForm @submit="onSubmit" :schema="schema" :state="state" class="space-y-4">
                        <UFormField name="password">
                            <UInput v-model="state.password" type="password" required placeholder="Password" class="w-full"/>
                        </UFormField>
                        <UFormField name="confirmPassword">
                            <UInput v-model="state.confirmPassword" type="password" required placeholder="Confirm password" class="w-full"/>
                        </UFormField>
                        <div class="flex flex-wrap items-center justify-between gap-2">
                            <UButton type="submit" label="Delete Forever" color="error" variant="subtle" class="truncate cursor-pointer"/>
                            <UButton @click="open = false" label="I want to keep my account." color="neutral" class="truncate cursor-pointer"/>
                        </div>
                    </UForm>
                </template>
            </UModal>
        </template>
    </UPageCard>
</template>

<script lang="ts" setup>
    import * as v from "valibot";
    import type { FormSubmitEvent } from "@nuxt/ui";
    import { deleteUser, signInWithEmailAndPassword } from "firebase/auth";

    const auth = useFirebaseAuth();
    const user = useCurrentUser();
    const toast = useToast();

    const open = ref<boolean>(false);

    const schema = v.pipe(
        v.object({
            password: v.pipe(v.string()),
            confirmPassword: v.pipe(v.string())
        }),
        v.forward(v.partialCheck(
            [["password"], ["confirmPassword"]],
            (input) => input.password === input.confirmPassword,
            "Passwords must match."
        ), ["confirmPassword"])
    );

    type Schema = v.InferOutput<typeof schema>;

    const state = reactive({ password: "", confirmPassword: "" });

    function onSubmit(event: FormSubmitEvent<Schema>) {
        if (!auth || !user.value || !user.value.email) return;

        signInWithEmailAndPassword(auth, user.value.email, event.data.password)
            .catch(() => {
                toast.add({ title: "Failed to delete the account", color: "error" })
            })
            .then(() => {
                if (!user.value) return;
                deleteUser(user.value);
            });
    }
</script>
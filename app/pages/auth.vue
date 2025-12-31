<template>
    <div class="grid place-items-center py-16 sm:py-24 lg:py-32 px-4">
        <UPageCard class="w-full max-w-md">
            <UForm v-if="forgotPassword" @submit="resetPassword" :schema="forgotPasswordSchema" :state="forgotPasswordState" class="space-y-4">
                <div class="flex items-center gap-2">
                    <UButton
                        @click="forgotPassword = false"
                        icon="i-lucide-arrow-left"
                        color="neutral"
                        variant="ghost"
                        class="cursor-pointer"
                        square
                    />
                    <h2 class="text-base text-pretty font-semibold text-highlighted">Forgot Password</h2>
                </div>
                <UFormField name="email">
                    <UInput v-model="forgotPasswordState.email" type="email" required placeholder="Enter your email" class="w-full"/>
                </UFormField>
                <UButton type="submit" label="Submit" class="cursor-pointer"/>
            </UForm>
            <UAuthForm
                v-else
                icon="i-lucide-user"
                :schema="isSignUp ? signUpSchema : signInSchema"
                :fields="isSignUp ? signUpFields : signInFields"
                :providers="providers"
                @submit="onSubmit"
            >
                <template #title>
                    {{ isSignUp ? "Welcome to " : "Welcome back to " }}<span class="text-primary">%</span>bet!
                </template>
                <template #description>
                    <span v-if="isSignUp">
                        Already have an account? <ULink @click="isSignUp = false" class="text-primary font-medium cursor-pointer">Sign in</ULink>
                    </span>
                    <span v-else>
                        Don't have an account? <ULink @click="isSignUp = true" class="text-primary font-medium cursor-pointer">Sign up</ULink>
                    </span>
                </template>
                <template #password-hint v-if="!isSignUp">
                    <ULink @click="forgotPassword = true" class="text-primary font-medium cursor-pointer">Forgot password?</ULink>
                </template>
                <template #footer v-if="isSignUp">
                    By signing in, you agree to our <ULink to="" class="text-primary font-medium">Terms of Service</ULink>.
                </template>
            </UAuthForm>
        </UPageCard>
    </div>
</template>

<script lang="ts" setup>
    import * as v from "valibot";
    import type { FormSubmitEvent, AuthFormField, ButtonProps } from "@nuxt/ui";
    import {createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail } from "firebase/auth";

    definePageMeta({ layout: "landing" });

    const auth = useFirebaseAuth();
    const toast = useToast();

    const isSignUp = ref(false);
    const forgotPassword = ref(false);

    const providers: ButtonProps[] = [{
        label: "Sign in with Google",
        icon: "i-devicon-google",
        class: "cursor-pointer",
        onClick: () => {
            if (!auth) return;
            signInWithPopup(auth, new GoogleAuthProvider()).catch(() => {
                toast.add({ title: "Something went wrong!", description: "Failed to sign in with Google.", color: "error" });
            });
        }
    }];

    const signUpFields: AuthFormField[] = [
        { name: "email", label: "Email", type: "email", placeholder: "Enter your email", required: true },
        { name: "password", label: "Password", type: "password", placeholder: "Enter your password", required: true },
        { name: "confirmPassword", label: "Confirm Password", type: "password", placeholder: "Confirm your password", required: true }
    ];

    const signInFields: AuthFormField[] = [
        { name: "email", label: "Email", type: "email", placeholder: "Enter your email", required: true },
        { name: "password", label: "Password", type: "password", placeholder: "Enter your password", required: true }
    ];

    const forgotPasswordState = reactive({ email: "" });

    const signUpSchema = v.pipe(
        v.object({
            email: v.pipe(v.string("Enter your email"), v.email("Invalid email")),
            password: v.pipe(v.string("Enter your password"), v.minLength(8, "Must be at least 8 characters long.")),
            confirmPassword: v.pipe(v.string("Confirm your password"))
        }),
        v.forward(
            v.partialCheck(
                [["password"], ["confirmPassword"]],
                (input) => input.password === input.confirmPassword,
                "The passwords do not match."
            ),
            ["confirmPassword"]
        )
    );

    const signInSchema = v.object({
        email: v.pipe(v.string("Enter your email"), v.email("Invalid email")),
        password: v.pipe(v.string("Enter your password"))
    });

    const forgotPasswordSchema = v.object({
        email: v.pipe(v.string("Enter your email"), v.email("Invalid email"))
    });

    type ForgotPasswordSchema = v.InferOutput<typeof forgotPasswordSchema>;

    function onSubmit(event: FormSubmitEvent<any>) {
        if (!auth) return;

        if (isSignUp.value) {
            createUserWithEmailAndPassword(auth, event.data.email, event.data.password)
                .then((data) => {
                    sendEmailVerification(data.user)
                })
                .catch(() => {
                    toast.add({ title: "Something went wrong!", description: "Failed to sign up.", color: "error" });
                });
        } else {
            signInWithEmailAndPassword(auth, event.data.email, event.data.password).catch(() => {
                toast.add({ title: "Something went wrong!", description: "Failed to sign in.", color: "error" })
            });
        }
    }

    function resetPassword(event: FormSubmitEvent<ForgotPasswordSchema>) {
        if (!auth) return;
        sendPasswordResetEmail(auth, event.data.email).then(() => {
            toast.add({ title: "Password Reset Email", description: "We have sent you password reset email.", color: "success" });
        });
    }
</script>
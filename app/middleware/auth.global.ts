
export default defineNuxtRouteMiddleware(async (to) => {
    if (to.path === "/") return;

    const user = await getCurrentUser();

    if (user && to.name === "auth") {
        return navigateTo("/app");
    }

    if (!user && to.name !== "auth") {
        return navigateTo("/auth");
    }
});
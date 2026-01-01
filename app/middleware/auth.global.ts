
export default defineNuxtRouteMiddleware(async (to) => {
    if (to.path === "/") return;

    const user = await getCurrentUser();

    if (user && to.name === "auth") {
        return navigateTo("/app");
    }

    if (!user && to.path.startsWith("/app")) {
        return navigateTo("/auth");
    }
});
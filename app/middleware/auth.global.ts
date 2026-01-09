
export default defineNuxtRouteMiddleware(async (to) => {
    if (to.path === "/") return;

    const user = await getCurrentUser();
    const protectedRoutes = ["/app", "/settings", "/verify"];

    if (!user && protectedRoutes.some(path => to.path.startsWith(path))) {
        return navigateTo("/auth");
    }

    if (user && user.emailVerified === false && to.path !== "/verify") {
        return navigateTo("/verify");
    }

    if (
        user &&
        user.emailVerified &&
        (to.path === "/auth" || to.path === "/verify")
    ) {
        return navigateTo("/app");
    }
});
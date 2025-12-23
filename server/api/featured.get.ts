export default defineEventHandler(async () => {
    try {
        return await $fetch("https://gamma-api.polymarket.com/events", { query: {
            active: true,
            closed: false,
            featured: true
        }});
    } catch {
        throw createError({
            statusCode: 500,
            statusMessage: "Failed to fetch Polymarket data"
        });
    }
});
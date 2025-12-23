export default defineEventHandler(async (event) => {
    const { slug } = getQuery(event);

    if (!slug) throw createError({
        statusCode: 400,
        statusMessage: "No slug provided"
    });

    try {
        return await $fetch(`https://gamma-api.polymarket.com/events/slug/${slug}`);
    } catch {
        throw createError({
            statusCode: 500,
            statusMessage: "Failed to fetch Polymarket data"
        });
    }
});
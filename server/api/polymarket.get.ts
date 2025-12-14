export default defineEventHandler(async (event) => {
    const { slug } = getQuery(event);

    if (!slug) throw createError({
        statusCode: 400,
        statusMessage: "No slug provided"
    });

    try {
        const data = await $fetch(`https://gamma-api.polymarket.com/events/slug/${slug}`);
        return data;
    } catch (e: any) {
        throw createError({
            statusCode: 500,
            statusMessage: "Failed to fetch Polymarket data"
        });
    }
});
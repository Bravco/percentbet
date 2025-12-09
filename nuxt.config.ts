// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ["@nuxt/ui"],
  css: ["~/assets/main.css"],
  runtimeConfig: {
    public: {
      WEB3FORMS_ACCESS_KEY: process.env.WEB3FORMS_ACCESS_KEY
    }
  },
  colorMode: {
    preference: "light"
  },
  app: {
    head: {
      htmlAttrs: {
        lang: "en"
      },
      title: "PercentBet - %bet",
      meta: [
        { name: "title", content: "PercentBet - %bet" },
        { name: "description", content: "An AI-powered tool that finds mispriced prediction markets and shows you your percentage edge." },
        { name: "keywords", content: "prediction markets, ai, trading, prediction markets ai" }
      ]
    }
  }
})

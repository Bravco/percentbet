// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false,
  modules: ["@nuxt/ui", "@nuxt/image", "nuxt-vuefire", "@pinia/nuxt"],
  css: ["~/assets/main.css"],
  runtimeConfig: {
    public: {
      WEB3FORMS_ACCESS_KEY: process.env.WEB3FORMS_ACCESS_KEY
    }
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
  },
  colorMode: {
    preference: "light"
  },
  ui: {
    theme: {
      colors: [
        "tertiary"
      ]
    }
  },
  vuefire: {
    config: {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
      measurementId: process.env.FIREBASE_MEASUREMENT_ID
    },
    auth: {
      enabled: true,
      sessionCookie: false
    }
  }
})
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false,
  modules: ["@nuxt/ui", "@nuxt/image", "nuxt-vuefire"],
  css: ["~/assets/main.css"],
  runtimeConfig: {
    public: {
      WEB3FORMS_ACCESS_KEY: process.env.WEB3FORMS_ACCESS_KEY,
      FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
      FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
      FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
      FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
      FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
      FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID
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
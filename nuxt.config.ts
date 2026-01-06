// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false,
  modules: ["@nuxt/ui", "@nuxt/image", "nuxt-vuefire", "@pinia/nuxt", "@nuxt/content"],
  css: ["~/assets/main.css"],
  runtimeConfig: {
    public: {
      WEB3FORMS_ACCESS_KEY: process.env.WEB3FORMS_ACCESS_KEY
    }
  },
  app: {
    head: {
      link: [
        { rel: "icon", type: "image/png", href: "/favicon-96x96.png", sizes: "96x96" },
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
        { rel: "shortcut icon", href: "/favicon.ico" },
        { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
        { rel: "manifest", href: "/site.webmanifest" }
      ],
      htmlAttrs: {
        lang: "en"
      },
      title: "PercentBet - %bet",
      meta: [
        { name: "title", content: "PercentBet - %bet" },
        { name: "description", content: "An AI-powered tool that finds mispriced prediction markets and shows you your percentage edge." },
        { name: "keywords", content: "prediction markets, ai, trading, prediction markets ai" },
        { name: "apple-mobile-web-app-title", content: "PercentBet" }
      ]
    }
  },
  colorMode: {
    preference: "light"
  },
  ui: {
    theme: {
      colors: [
        "primary",
        "secondary",
        "tertiary",
        "success",
        "error",
        "warning",
        "info"
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
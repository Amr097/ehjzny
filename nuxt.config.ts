// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },

  // App configuration
  app: {
    head: {
      title: "Ehjzni",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/full.png" }],
    },
  },

  modules: [
    "@nuxtjs/tailwindcss",
    ["@vee-validate/nuxt", { autoImports: true }],
  ],
  tailwindcss: {
    exposeConfig: true,
    viewer: true,
  },

  // Runtime config with environment variables
  runtimeConfig: {
    public: {
      apiBase: "https://staging.ehjzny.com/api/v1",
      appId: "h66w3DSEcsKlu8ReaclX",
    },
  },
});

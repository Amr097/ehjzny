// plugins/toast.js
import { defineNuxtPlugin } from '#app';
import Toast from 'vue-toastification/dist/index.mjs';
import 'vue-toastification/dist/index.css';

export default defineNuxtPlugin((nuxtApp) => {
  // Toast configuration options
  const options = {
    // Default toast position
    position: 'top-right',

    // Default timeout (ms)
    timeout: 5000,

    // Close on click
    closeOnClick: true,

    // Pause timer on hover
    pauseOnHover: true,

    // Show progress bar
    hideProgressBar: false,

    // Allow duplicates
    filterBeforeCreate: (toast, toasts) => {
      if (toasts.filter((t) => t.content === toast.content).length !== 0) {
        // Returning false discards the toast
        return false;
      }
      return toast;
    },
  };

  // Register the toast plugin
  nuxtApp.vueApp.use(Toast, options);

  // Make the toast functions available throughout the app
  return {
    provide: {
      toast: {
        success: (message, options) =>
          nuxtApp.vueApp.config.globalProperties.$toast.success(
            message,
            options
          ),
        error: (message, options) =>
          nuxtApp.vueApp.config.globalProperties.$toast.error(message, options),
        info: (message, options) =>
          nuxtApp.vueApp.config.globalProperties.$toast.info(message, options),
        warning: (message, options) =>
          nuxtApp.vueApp.config.globalProperties.$toast.warning(
            message,
            options
          ),
        default: (message, options) =>
          nuxtApp.vueApp.config.globalProperties.$toast(message, options),
      },
    },
  };
});

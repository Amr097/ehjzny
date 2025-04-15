<template>
  <div class="max-w-4xl mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6">Select a Doctor</h1>

    <form @submit="onSubmit">
      <!-- Loading state -->
      <div
        v-if="status === 'pending'"
        class="flex justify-center items-center py-8"
      >
        <div
          class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"
        ></div>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="bg-red-50 p-4 rounded-md text-red-600 mb-4">
        {{ error }}
      </div>

      <!-- Doctor selection -->
      <div v-else>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Choose your doctor *
          </label>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="resource in resources.result"
              :key="resource.id"
              class="border rounded-lg overflow-hidden shadow-sm hover:shadow-md"
              :class="{
                'ring-2 ring-blue-500': doctorId === resource.id,
              }"
            >
              <div class="flex flex-col h-full">
                <!-- Resource header with avatar -->
                <div class="flex items-center p-4 bg-gray-50 border-b">
                  <div
                    class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3"
                  >
                    <span class="text-lg font-bold text-blue-500">{{
                      resource.name.charAt(0)
                    }}</span>
                  </div>
                  <div class="flex-1">
                    <h2 class="text-lg font-semibold">{{ resource.name }}</h2>
                    <p class="text-gray-500 text-sm">
                      {{ resource.description || 'Available for booking' }}
                    </p>
                  </div>
                </div>

                <!-- Doctor services -->
                <div class="p-4 flex-1">
                  <div
                    v-for="type in resource.types"
                    :key="type.id"
                    class="mb-2"
                  >
                    <div class="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="mr-2 text-gray-500"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      <span class="text-sm"
                        >{{ type.name }} ({{ type.minutes }} min)</span
                      >
                      <span
                        v-if="type.price && type.price !== '0.00'"
                        class="ml-2 text-sm font-medium"
                      >
                        ${{ type.price }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Selection radio button -->
                <div class="p-3 border-t bg-gray-50">
                  <label class="flex items-center cursor-pointer">
                    <input
                      v-model="doctorId"
                      type="radio"
                      :value="resource.id"
                      name="doctor"
                      class="form-radio h-5 w-5 text-blue-500"
                    />
                    <span class="ml-2">Select this doctor</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div v-if="errorMessage" class="mt-2 text-red-500 text-sm">
            {{ errorMessage }}
          </div>
        </div>

        <!-- Submit button -->
        <div class="mt-6">
          <button
            type="submit"
            class="w-full md:w-auto px-6 py-3 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
            :disabled="status === 'pending'"
          >
            Select Doctor
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import * as yup from 'yup';

const props = defineProps({
  resources: {
    type: Object,
    required: true,
  },
  status: {
    type: String,
  },
  error: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['submit-resource']);

// Setup validation schema
const validationSchema = yup.object({
  doctor: yup.string().required('Please select a doctor to continue'),
});

// Setup form with validation schema
const { handleSubmit } = useForm({
  validationSchema,
});

// Setup field with validation
const { value: doctorId, errorMessage } = useField('doctor');

const onSubmit = handleSubmit((values) => {
  try {
    // Emit event to trigger API call
    emit('submit-resource', {
      resourceId: values.doctor,
    });
  } catch (error) {
    console.error('Submission error:', error);
  }
});
</script>

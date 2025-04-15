<template>
  <div class="mt-8 max-w-4xl mx-auto">
    <h2 class="text-xl font-bold mb-4">Available appointmentTime</h2>
    <!-- Loading state -->

    <form @submit.prevent="onSubmit">
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

      <div v-else>
        <div class="date-selection mb-6">
          <div
            v-for="dateOption in appointmentTime.result"
            :key="dateOption.date"
            class="mb-2"
          >
            <label class="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                :value="dateOption.date"
                v-model="dateValue"
                class="text-blue-600"
              />
              <span>{{ dateOption.display }}</span>
            </label>
          </div>
          <div v-if="dateErrorMessage" class="text-red-500 text-sm mt-1">
            {{ dateErrorMessage }}
          </div>
        </div>

        <div v-if="dateValue" class="time-selection">
          <label class="block mb-2 font-medium">Select Time:</label>
          <select
            v-model="timeValue"
            class="w-full p-2 border border-gray-300 rounded"
            placeholder="Select Time"
          >
            <option value="" disabled>Select a time</option>
            <option
              v-for="timeOption in availableTimes"
              :key="timeOption.time"
              :value="timeOption"
            >
              {{ timeOption.display }}
            </option>
          </select>
          <div v-if="timeErrorMessage" class="text-red-500 text-sm mt-1">
            {{ timeErrorMessage }}
          </div>
        </div>

        <div
          v-if="timeValue"
          class="selection-summary mt-4 p-3 bg-blue-50 rounded"
        >
          <p>
            Selected:
            <span class="font-semibold"
              >{{ selectedDateDisplay }} at {{ timeValue.display }}</span
            >
          </p>
        </div>
      </div>

      <div class="mt-6">
        <button
          type="submit"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
          :disabled="status === 'pending'"
        >
          Confirm Selection
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import * as yup from 'yup';

const { appointmentTime, status, error } = defineProps({
  appointmentTime: {
    type: Object,
    default: () => {
      result: [];
    },
  },
  status: {
    type: String,
  },
  error: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['timeSelected']);

// Setup validation schema
const validationSchema = yup.object({
  date: yup.string().required('Please select a date'),
  time: yup.mixed().required('Please select a time'),
});

// Setup form with validation schema
const { handleSubmit, resetForm: resetTimeSelectForm } = useForm({
  validationSchema,
});

// Setup fields with validation
const { value: dateValue, errorMessage: dateErrorMessage } = useField('date');
const { value: timeValue, errorMessage: timeErrorMessage } = useField('time');

// Computed property to get the available times for the selected date
const availableTimes = computed(() => {
  if (!dateValue.value) return [];
  const dateOption = appointmentTime.result.find(
    (d) => d.date === dateValue.value
  );
  return dateOption ? dateOption.times : [];
});

// Computed property to get the display date for the selected date
const selectedDateDisplay = computed(() => {
  if (!dateValue.value) return '';
  const dateOption = appointmentTime.result.find(
    (d) => d.date === dateValue.value
  );
  return dateOption ? dateOption.display : '';
});

// Function to emit the selected time to the parent
function emitSelection() {
  if (timeValue.value) {
    emit('timeSelected', {
      date: dateValue.value,
      dateDisplay: selectedDateDisplay.value,
      time: timeValue.value.time,
      timeDisplay: timeValue.value.display,
    });
  }
}

// Form submission handler
const onSubmit = handleSubmit(() => {
  emitSelection();
});

// Expose reset function
defineExpose({
  resetTimeSelectForm,
});
</script>

<style scoped></style>

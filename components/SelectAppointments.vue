<template>
  <div class="mt-8 max-w-4xl mx-auto">
    <h2 class="text-xl font-semibold mb-4">Select Appointment Type</h2>

    <form @submit="onSubmit">
      <!-- Loading state -->
      <div
        v-if="status === 'pending'"
        class="flex justify-center items-center py-6"
      >
        <div
          class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"
        ></div>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="bg-red-50 p-4 rounded-md text-red-600">
        {{ error }}
      </div>

      <!-- No appointments available -->
      <div
        v-else-if="!filteredAppointments.length"
        class="bg-yellow-50 p-4 rounded-md text-yellow-700"
      >
        No appointment slots available for the selected type.
      </div>

      <!-- Appointments list -->
      <div v-else class="grid gap-3">
        <div
          v-for="appointment in filteredAppointments"
          :key="appointment.id"
          class="border rounded-lg p-3 hover:shadow-sm"
          :class="{
            'ring-2 ring-blue-500 bg-blue-50':
              appointmentField === appointment.id,
          }"
        >
          <label class="flex items-center cursor-pointer w-full">
            <input
              v-model="appointmentField"
              type="radio"
              :value="appointment.id"
              name="appointment"
              class="form-radio h-5 w-5 text-blue-500"
            />

            <div class="ml-3 flex flex-1 items-center justify-between">
              <!-- Date and time -->
              <div>
                <div class="font-medium">
                  {{ appointment.name }}
                </div>
                <!-- Duration -->
                <div class="text-sm text-gray-500 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="mr-1"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  {{ appointment.minutes }}
                  minutes
                </div>
              </div>
            </div>
          </label>
        </div>
      </div>

      <div v-if="errorMessage" class="mt-2 text-red-500 text-sm">
        {{ errorMessage }}
      </div>

      <!-- Submit button -->
      <div class="mt-6">
        <button
          type="submit"
          class="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          :disabled="status === 'pending'"
        >
          Book Appointment
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import * as yup from 'yup';

const props = defineProps({
  selectedDoctor: {
    type: [String, Number],
    required: true,
  },
  appointmentTypes: {
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

// Watch for changes in appointment types and log them
watch(
  () => props.appointmentTypes,
  (newTypes) => {
    console.log('Appointment types changed:', newTypes);
  },
  { deep: true }
);

const emit = defineEmits(['appointment-selected']);

// Filter appointments based on the selected doctor
const filteredAppointments = computed(() => {
  if (!props.appointmentTypes || !props.appointmentTypes.result) {
    return [];
  }

  return props.appointmentTypes.result.filter((item) =>
    item.resources.some((resource) => resource.id == props.selectedDoctor)
  );
});

// Setup validation schema
const validationSchema = yup.object({
  appointment: yup.string().required('Please select an appointment time'),
});

// Setup form with validation schema
const { handleSubmit, resetForm: resetAppointmentForm } = useForm({
  validationSchema,
});

// Setup field with validation
const { value: appointmentField, errorMessage } = useField('appointment');

const onSubmit = handleSubmit((values) => {
  if (!values.appointment) return;

  try {
    // Find the selected appointment object
    const selectedAppointment = filteredAppointments.value.find(
      (appointment) => appointment.id === values.appointment
    );

    // Emit the selected appointment
    emit('appointment-selected', selectedAppointment);
  } catch (error) {
    console.error('Submission error:', error);
  }
});

//Expose a reset form function
defineExpose({
  resetAppointmentForm,
});
</script>

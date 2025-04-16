<template>
  <SelectResource
    :resources
    :status
    :error
    @submit-resource="onResourceSelection"
  />
  <SelectAppointments
    ref="appointmentsRef"
    :appointmentTypes
    :status="appointmentTypesStatus"
    :error="appointmentTypesError"
    :selectedDoctor
    v-if="selectedDoctor"
    @appointment-selected="onAppointmentTypeSelected"
  />

  <SelectTime
    ref="timeRef"
    :appointmentTime
    :status="appointmentTimeStatus"
    :error="appointmentTimeError"
    v-if="selectedAppointmentType"
    @timeSelected="handleTimeSelection"
  />
</template>

<script setup>
const config = useRuntimeConfig();

const AVAILBLE_RESOURCES_ENDPOINT = 'availability/resources';

const appointmentsRef = ref(null); // Ref for SelectAppointments component methods
const timeRef = ref(null); // Ref for SelectTime component methods

// Fetch APIs composable
const { fetchAvailableTypes, fetchAvailableTimes } = useBookingApi();

//Feature state composable
const {
  selectedDoctor,
  selectedAppointmentType,

  handleResourceSelection,
  handleAppointmentTypeSelection,
  handleTimeSelection,
} = useBookingState(appointmentsRef, timeRef);

//Fetch resources on page load
const {
  data: resources,
  error,
  status,
} = useFetch(`${config.public.apiBase}/${AVAILBLE_RESOURCES_ENDPOINT}`, {
  method: 'POST',
  headers: {
    'X-App-ID': config.public.appId,
    'Content-Type': 'application/json',
  },
});

//Fetch appointment types
const {
  data: appointmentTypes,
  status: appointmentTypesStatus,
  error: appointmentTypesError,
  execute: appointmentsExecute,
} = useAsyncData(
  'get-appointments-types',
  () => {
    return fetchAvailableTypes();
  },
  {
    default: () => ({ result: [] }),
  }
);

//Fetch appointment available times
const {
  data: appointmentTime,
  status: appointmentTimeStatus,
  error: appointmentTimeError,
  execute: appointmentTimeExecute,
} = useAsyncData(
  'get-appointments-time',
  () => {
    return fetchAvailableTimes(
      selectedAppointmentType.value.id,
      selectedDoctor.value
    );
  },
  {
    immediate: false,
    default: () => ({ result: [] }),
  }
);

const onResourceSelection = async ({ resourceId }) => {
  //Fetch data if user selects new option
  if (handleResourceSelection(resourceId)) appointmentsExecute();
};

const onAppointmentTypeSelected = async (appointment) => {
  //Fetch data if user selects new option
  if (handleAppointmentTypeSelection(appointment)) appointmentTimeExecute();
};
</script>

<style lang="postcss" scoped></style>

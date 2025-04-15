<!-- pages/resource-selection.vue -->
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

const appointmentsRef = ref(null);
const timeRef = ref(null);

const { fetchAvailableTypes, fetchAvailableTimes } = useBookingApi();

const {
  selectedDoctor,
  selectedAppointmentType,

  handleResourceSelection,
  handleAppointmentTypeSelection,
  handleTimeSelection,
} = useBookingState(appointmentsRef, timeRef);

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
  if (handleResourceSelection(resourceId)) appointmentsExecute();
};

const onAppointmentTypeSelected = async (appointment) => {
  if (handleAppointmentTypeSelection(appointment)) appointmentTimeExecute();
};
</script>

<style lang="postcss" scoped></style>

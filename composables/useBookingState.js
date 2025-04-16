import { ref } from 'vue';
import { useBookingApi } from './useBookingApi';

export function useBookingState(appointmentsRef, timeRef) {
  const selectedDoctor = ref(null);
  const selectedAppointmentType = ref(null);

  const { bookAppointment } = useBookingApi();

  const resetAppointmentType = () => {
    selectedAppointmentType.value = null;
    if (appointmentsRef.value) {
      appointmentsRef.value.resetAppointmentForm();
    }
  };

  const resetAppointmentTime = () => {
    if (timeRef.value) timeRef.value.resetTimeSelectForm();
  };

  const handleResourceSelection = (resourceId) => {
    //Don't call api again if value has not change
    if (selectedDoctor.value === resourceId) return;

    selectedDoctor.value = resourceId;

    //Reset form values on new api calls
    if (timeRef.value) resetAppointmentType();

    return { resourceId };
  };

  const handleAppointmentTypeSelection = (appointment) => {
    //Don't call api again if value has not change
    if (selectedAppointmentType.value?.id === appointment.id) return;

    selectedAppointmentType.value = appointment;

    //Reset form values on new api calls
    resetAppointmentTime();

    return { typeId: appointment.id, resourceId: selectedDoctor.value };
  };

  const handleTimeSelection = async (selectedTime) => {
    const bookingData = {
      date: selectedTime.date,
      time: selectedTime.time,
      type: selectedAppointmentType.value.id,
    };

    return await bookAppointment(bookingData, selectedDoctor.value);
  };

  return {
    // State
    selectedDoctor,
    selectedAppointmentType,
    appointmentsRef,
    timeRef,

    // Methods
    resetAppointmentType,
    resetAppointmentTime,
    handleResourceSelection,
    handleAppointmentTypeSelection,
    handleTimeSelection,
  };
}

// useBookingApi.js
import { useToast } from 'vue-toastification';
import { useRuntimeConfig } from 'nuxt/app';

export function useBookingApi() {
  const toast = useToast();
  const config = useRuntimeConfig();

  const ENDPOINTS = {
    AVAILABLE_RESOURCES: 'availability/resources',
    AVAILABLE_TYPES: 'availability/types',
    AVAILABLE_TIMES: 'availability/times',
    SCHEDULE_BOOKING: 'customer/scheduling/new',
  };

  const fetchAvailableTypes = async (options = {}) => {
    try {
      return await $fetch(
        `${config.public.apiBase}/${ENDPOINTS.AVAILABLE_TYPES}`,
        {
          method: 'POST',
          headers: {
            'X-App-ID': config.public.appId,
            'Content-Type': 'application/json',
          },
          ...options,
        }
      );
    } catch (error) {
      toast.error('Failed to fetch appointment types');
      console.error('Error fetching appointment types:', error);
      throw error;
    }
  };

  const fetchAvailableTimes = async (typeId, resourceId, options = {}) => {
    try {
      return await $fetch(
        `${config.public.apiBase}/${ENDPOINTS.AVAILABLE_TIMES}`,
        {
          method: 'POST',
          headers: {
            'X-App-ID': config.public.appId,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: typeId,
            resourceFilters: {
              resource: resourceId,
            },
          }),
          ...options,
        }
      );
    } catch (error) {
      toast.error('Failed to fetch available times');
      console.error('Error fetching available times:', error);
      throw error;
    }
  };

  const bookAppointment = async (data, resourceId) => {
    try {
      const response = await $fetch(
        `${config.public.apiBase}/${ENDPOINTS.SCHEDULE_BOOKING}`,
        {
          method: 'PUT',
          headers: {
            'X-App-ID': config.public.appId,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...data,
            resourceFilters: {
              resource: resourceId,
            },
          }),
        }
      );

      toast.success('Successfully booked your appointment');
      return response;
    } catch (error) {
      toast.error('Failed to book appointment');
      console.error('Error booking appointment:', error);
      throw error;
    }
  };

  return {
    fetchAvailableTypes,
    fetchAvailableTimes,
    bookAppointment,
  };
}

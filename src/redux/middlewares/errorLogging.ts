import { isRejectedWithValue, Middleware } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

export const rtkQueryErrorLogger: Middleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const payload = action.payload as any;
    const status = payload?.status;
    const endpoint = (action as any).meta?.arg?.endpointName;

    if (status === 401) {
      if (endpoint === 'refreshToken') {
        toast.error("Session expired. Please login again.");
        return next(action);
      }
      return next(action);
    }

    toast.error(payload?.data?.detail || "An error occurred");
  }
  return next(action);
};
import { handleAxiosError } from "../utils/handleAxiosError";
import axiosInstance from "../utils/axiosInstance";
import { NotificationAdmin } from "../Types";

export const NotificationService = {
  getAll: async () => {
    try {
      const res = await axiosInstance.get('/Notification');
      return res.data;
    } catch (e: any) {
      console.error("Error fetching notifications:", e);
      throw e;
    }
  },

  create: async (notification: NotificationAdmin) => {
    try {
      const res = await axiosInstance.post('/Notification', notification);
      return res.data;
    } catch (e: any) {
      handleAxiosError(e, "הוספת ההודעה נכשלה");
    }
  },

  delete: async (id: number) => {
    try {
      await axiosInstance.delete(`/Notification/${id}`);
    } catch (e: any) {
      handleAxiosError(e, "מחיקת ההתראה נכשלה");
    }
  },

  markAsRead: async (id: number) => {
    try {
      await axiosInstance.put(`/Notification/${id}/mark-as-read`);
    } catch (e: any) {
      handleAxiosError(e, "סימון כהתראה נקראה נכשל");
    }
  }
};

import axiosInstance from "../utils/axiosInstance";
import { handleAxiosError } from "../utils/handleAxiosError";
import { NotificationService } from "./NotificationService";




export const EmailService = {

    sendAnEmail: async (name: string,email: string, message: string) => {
        try {
            const res = await axiosInstance.post(`/Email`, {
               name,
                 email,
              message
            });
            return res.data;
        } catch (e: any) {
            if (e.response && e.response.status === 404) {
                  NotificationService.create({
                            title: "the email was not sent",
                            message: "please try again later",
                            type: "error",
                            priority: "medium",
                           timestamp: new Date(),
                          });
                return null;
            }
            handleAxiosError(e, "המייל לא נשלח");
            return null;
        }
    }

};

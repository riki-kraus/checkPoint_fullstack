import { handleAxiosError } from "../utils/handleAxiosError";
import axiosInstance from "../utils/axiosInstance";
import { NotificationService } from "./NotificationService";

export const StudentSheetService = {

    getStudentEmail: async (firstName: string, lastName: string, className: string) => {
        try {
            const res = await axiosInstance.get(`/Sheet/email`, {
                params: {
                    firstName,
                    lastName,
                    className
                }
            });
            return res.data.email;
        } catch (e: any) {
            if (e.response && e.response.status === 404) {
                  NotificationService.create({
                            title: "hoops! ",
                            message: "the student was not found",
                            type: "error",
                            priority: "medium",
                           timestamp: new Date(),
                          });
                return null;
            }
            handleAxiosError(e, "שגיאה בשליפת כתובת מייל");
            return null;
        }
    }

};

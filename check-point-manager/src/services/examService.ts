import { Exam } from "../Types";
import { handleAxiosError } from "../utils/handleAxiosError";
import axiosInstance from "../utils/axiosInstance";
import { NotificationService } from "./NotificationService";

export const ExamService = {
    getAll: async () => {
        try {
            const res = await axiosInstance.get('/Exam');
            return res.data;
        } catch (e: any) {
            console.error("Error fetching exams:", e);
            throw e;
        } 
    },

    create: async (exam: Partial<Exam>) => {
        try {
            const res = await axiosInstance.post('/Exam', exam);
            return res.data;
        } catch (e: any) {
            handleAxiosError(e, "הוספת המבחן נכשלה");
            throw e;
        }
    },

 getBySubjectAndDate: async (subject:string,date:string) => {
    try {
        const res = await axiosInstance.get(`/Exam/BySubjectAndDate/${subject},${date}`);
        return res.data;
    } catch (e: any) {
        handleAxiosError(e, "שליפת המבחן נכשלה");
          NotificationService.create({
                                title: "the exam was not found",
                                message: "please upload the results test before uploading the submissions",
                                type: "info",
                                priority: "high",
                               timestamp: new Date(),
                              });
        throw e;
    }
},

    delete: async (id: number|undefined) => {
        try {
            const res = await axiosInstance.delete(`/Exam/${id}`);
            return res.data;
        } catch (e: any) {
            handleAxiosError(e, "המחיקה נכשלה");
            throw e;
        }
    }
  
};

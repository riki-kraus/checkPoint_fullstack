import { Answer } from "../Types";
import axiosInstance from "../utils/axiosInstance";
import { handleAxiosError } from "../utils/handleAxiosError";


export const AnswerService = {
  
    create: async (answer: Partial<Answer>) => {
        try {
            const res = await axiosInstance.post('/Answer', answer);
            return res.data;
        } catch (e: any) {
            handleAxiosError(e, "הוספת התשובה נכשלה");
            throw e;
        }
    },
    getByExamId:async(examId:number|undefined)=>
    {
        try {
            const res = await axiosInstance.get(`/Answer/examId/${examId}`);
            return res.data;
        } catch (e: any) {
            handleAxiosError(e, "הבאת התשובות נכשלה");
            throw e;
        }
    },
    deleteByExamId:async(examId:number|undefined)=>
    {
        try {
            const res = await axiosInstance.delete(`/Answer/examId/${examId}`)          

            return res.data;
        } catch (e: any) {
            handleAxiosError(e, "הבאת התשובות נכשלה");
           // throw e;
        }
    }
    
};


import { Student } from "../Types";
import { handleAxiosError } from "../utils/handleAxiosError";
import axiosInstance from "../utils/axiosInstance";


export const StudentService = {
    getAll: async () => {
        try {
            const res = await axiosInstance.get('/Student');
            return res.data;
        } catch (e: any) {
            console.error("Error fetching students:", e);
            throw e;
        }
        
    },

    getById: async (id: number) => {
        try {
            const res = await axiosInstance.get(`/Student/id/${id}`);
            return res.data;
        } catch (e: any) {
            console.error(`Error fetching student with ID ${id}:`, e);
            //
            throw e;
        }
    },

    getByClass: async (_class: string) => {
        try {
            const res = await axiosInstance.get(`/Student/class/${_class}`);
            return res.data;
        } catch (e: any) {
            console.error(`Error fetching students from class ${_class}:`, e);
            handleAxiosError(e, "כיתה זו לא קיימת");
            throw e;
        }

    },
    getByFullNameAndClass: async (ClassName: string, FirstName: string, LastName: string) => {
       
        try {
            const res = await axiosInstance.get(`/Student/byFullName`, {
                params: {
                    FirstName,
                    LastName,
                    ClassName // שים לב לשינוי כאן
                }
            });
            return res.data;
        } catch (e: any) {
            console.error(`Error fetching student ${FirstName} ${LastName} from class ${ClassName}:`, e);
            handleAxiosError(e, "תלמיד זה לא קיים בכיתה זו");
            throw e;
        }
    },

    create: async (student: Partial<Student>) => {
        try {
            const res = await axiosInstance.post('/Student', student);
            return res.data;
        } catch (e: any) {
            handleAxiosError(e, "הוספת המשתמש נכשלה");
            throw e;
        }
    },

    update: async (id: number, student: Partial<Student>) => {
        try {
            const res = await axiosInstance.put(`/Student/${id}`, student);
            return res.data;
        } catch (e: any) {
            handleAxiosError(e, "עדכון הפרטים נכשל");
            throw e;
        }
    },

    delete: async (id: number) => {
        try {
            const res = await axiosInstance.delete(`/Student/${id}`);
            return res.data;
        } catch (e: any) {
            handleAxiosError(e, "המחיקה נכשלה");
            throw e;
        }
    }
    
};

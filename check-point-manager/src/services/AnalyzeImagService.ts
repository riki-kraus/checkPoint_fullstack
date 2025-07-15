// import axios from 'axios';
// import { number } from 'yup';

import axiosInstance from "../utils/axiosInstance";



export const analyzeImage = async (base64Image: string) => {
  try {
    const response = await axiosInstance.post(`/Ocr/analyze-image`, { base64Image: base64Image });
    return response.data.responses[0]?.textAnnotations.slice(1) || null;
  } catch (error: any) {
  
    console.error('Error calling server OCR endpoint:', error);
    return null;
  }
};

const AnalyzeImageService = () => {
  return { analyzeImage };
};

export default AnalyzeImageService;



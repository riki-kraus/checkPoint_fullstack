import  { analyzeImage } from "../services/AnalyzeImagService";
import { Exam, Student } from "../Types";





// export const extractExam = (words: any[]): Exam => {
//     const getText = (start: number, count: number) =>
//       words.slice(start, start + count).map(w => w.description).join(" ");

//     const dateIdx = words.findIndex(w => w.description === "תאריך");
//     const subjectIdx = words.findIndex(w => w.description === "מקצוע");

//     if (dateIdx === -1 || subjectIdx === -1) {
//       throw new Error("שדות חיוניים חסרים");
//     }

//     const dateExam = getText(dateIdx + 2, 4).replace(/([א-ת])\s'/, "$1'"); // הוספתי כאן את dateExam

//     return {
//       dateExam,
//       subject: getText(subjectIdx + 2, 2),
//       file_Url_Exam: `exams/results/${(getText(subjectIdx + 2, 2))}/${(dateExam)}.jpg` // המרה לפורמט URL
//     };
// };
export const extractExam = (words: any[]): Exam => {
  const getText = (start: number, end: number) =>
    words.slice(start, end).map(w => w.description).join(" ");

  const dateIdx = words.findIndex(w => w.description === "תאריך");
  const subjectIdx = words.findIndex(w => w.description === "מקצוע");

  if (dateIdx === -1 || subjectIdx === -1) {
    throw new Error("שדות חיוניים חסרים");
  }

  const subject = getText(subjectIdx + 2, dateIdx).trim();
  const dateExam = getText(dateIdx + 2, dateIdx + 6).replace(/([א-ת])\s'/, "$1'");

  return {
    dateExam,
    subject,
    file_Url_Exam: `exams/results/${subject}/${dateExam}.jpg`
  };
};


  const findSectionLetter = (arr: string[], from: number): string => {
    const reversed = arr.slice(0, from + 1).reverse();
  
    for (let i = 0; i < reversed.length - 1; i++) {
      const val = reversed[i];
      const next = reversed[i - 1];

      if (/^[א-ת]$/.test(val) && next === ".") {
        // if (/^[א-ת]$/.test(val) ) {
console.log("val",val);
console.log("next",next);

        return val;
      }
    }
  
    return "?";
  };
  
export const extractStudent=(res:any)=>
{ 
  let firstName = "";
  let lastName = "";
  let _class = "";
  
  res.forEach((item: any, index: number) => {
    if (item.description === "שם") {
      firstName = res[index + 2]?.description || "";
      lastName = res[index + 3]?.description || "";
    }
    if (item.description === "כיתה") {
      _class = (res[index + 2]?.description || "") + (res[index + 3]?.description || "");
    }
  });
  
  const student: Student = {
    firstName,
    lastName,
    class: _class
  };
  
  return student;
  
}
  export const extractAnswers = (words: any[], exam: Exam | undefined) => {
    console.log("hi")
    const textArray = words.map(w => w.description);
    const results = [];

    for (let i = 0; i < textArray.length - 5; i++) {
      if (textArray.slice(i, i + 5).join(" ") === "מספר התשובה הנכונה הוא :") {
        let correctAnswer = textArray[i + 5];
        if (['/', '^', '\\', '|'].includes(correctAnswer)) correctAnswer = '1';
        if (correctAnswer === 's') correctAnswer = '5';
        const examId = exam?.id;
        console.log("textArray")
        console.log(textArray)

        results.push({
          examId,
          section: findSectionLetter(textArray, i),
          correctAnswer,
        });
      }
    }
    console.log("Extracted answers:", results);
    return results;
  };

  export const Analyze = async ( selectedImage:string) => {
    console.log("Analyzing image:", selectedImage);
    if (!selectedImage) return;
    try {
      const words = await analyzeImage(selectedImage);
      if (!words) return;
      return (words);
    } catch (err) {
      console.error("Error analyzing image:", err);
    }
  };


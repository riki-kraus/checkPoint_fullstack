import axios from "axios";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  ImageRun,
} from "docx";
import { Exam, Student } from "../Types";
import axiosInstance from "./axiosInstance";

// פונקציית עזר
const createTextRun = (text: string, options?: Partial<{ bold: boolean }>) =>
  new TextRun({
    text,
    font: "Calibri Light",
    size: 48,
    bold: options?.bold,
  });

const createParagraph = (
  textRuns: TextRun[],
  alignment = AlignmentType.CENTER,
  spaceAfter = 200
) =>
  new Paragraph({
    alignment,
    spacing: { after: spaceAfter, line: 320 },
    bidirectional: true,
    children: textRuns,
  });

const createImageFromDataURL = async (dataURL: string): Promise<ImageRun> => {
  const [meta, base64] = dataURL.split(",");
  const byteArray = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  const options: any = {
    data: byteArray,
    transformation: { width: 200, height: 100 },
  };
  if (meta.includes("image/png")) options.type = "PNG";
  return new ImageRun(options);
};

const createWordFile = async (
  exam: Exam,
  student: Student,
  score: number,
  answerText: string,
  signature?: string | null
): Promise<{ blob: Blob; fileName: string }> => {
  const fullName = `${student.firstName} ${student.lastName}`;
  const fileName = `feedback_${exam.dateExam.replace(/\s+/g, "_")}.docx`;
  const answerLines = answerText.split("\n").filter(Boolean);

  const children: Paragraph[] = [
    createParagraph([createTextRun("בס\"ד", { bold: true })], AlignmentType.CENTER, 300),
    createParagraph([createTextRun("🎊 דף משוב לתלמיד", { bold: true })]),
    createParagraph([createTextRun(fullName, { bold: true })]),
    createParagraph([createTextRun(`${exam.subject} - ${exam.dateExam}`)]),
    createParagraph([createTextRun(`הציון שלך: ${score} – כל הכבוד 🎉`)]),
    createParagraph([createTextRun("התשובות:", { bold: true })]),
    ...answerLines.map((line) => createParagraph([createTextRun(`• ${line}`)])),
    createParagraph([createTextRun("הערות: מבחן מעולה! ידעת נפלא!")]),
    createParagraph([createTextRun("חתימה:")]),
  ];

  if (signature) {
    const signatureImageRun = await createImageFromDataURL(signature);
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [signatureImageRun],
      })
    );
  } else {
    children.push(createParagraph([createTextRun("_________________________")]));
  }

  const doc = new Document({
    sections: [{ properties: {}, children }],
  });

  const blob = await Packer.toBlob(doc);
  return { blob, fileName };
};

type UploadAllProps = {
  exams: Exam[] | null;
  students: Student[] | null;
  marks: number[] | null;
  answers: (string | null)[] | null;
  signature: string | null;
};

export const uploadAllWordFiles = async ({
  exams,
  students,
  marks,
  answers,
  signature,
}: UploadAllProps) => {

  if (
    !exams ||
    !students ||
    !marks ||
    !answers ||
    exams.length !== students.length ||
    students.length !== marks.length ||
    students.length !== answers.length
  ) {
    alert("בעיה: כמות הנתונים לא תואמת או חסרים פרטים.");
    return;
  }

  try {
    for (let i = 0; i < students.length; i++) {
      const student = students[i];
      const exam = exams[i];
      const mark = marks[i];
      const answerText = answers[i] ?? "";

      const { blob, fileName } = await createWordFile(
        exam,
        student,
        mark,
        answerText,
        signature
      );

      const response = await axiosInstance.get("/upload/presigned-url",
        {
          params: {
            fileName,
            type: "student",
            subjectName: exam.subject,
            studentName: `${student.firstName} ${student.lastName}`,
            className: student.class ?? "ללא כיתה",
            contentType:
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          },
        }
      );

      const uploadUrl = response.data.url;

      await axios.put(uploadUrl, blob, {
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          // "x-amz-acl": "bucket-owner-full-control",
        },
      });

    }

    alert("כל קבצי ה־Word הועלו בהצלחה ל־S3!");
  } catch (error) {
    console.error("❌ שגיאה בהעלאה:", error);
    alert("אירעה שגיאה בהעלאה.");
  }
};

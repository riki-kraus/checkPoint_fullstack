
import { useState, useEffect, useContext, useRef, useMemo } from "react";
import { Outlet, Link } from "react-router-dom";
import { AnswerService } from "../services/answerService";
import { ExamService } from "../services/examService";
import { extractExam, extractAnswers, Analyze, extractStudent } from "../utils/ocr";
import { Answer, Exam, Student } from "../Types";
import StepperContext from "./context/StepperContext";
import { SubmissionService } from "../services/SubmissionService";
import { StudentService } from "../services/studentService";
import { StudentSheetService } from "../services/studentSheet";
import { EmailService } from "../services/emailService";
import "../styles/StudentTests.css";
import { NotificationService } from "../services/NotificationService";


const StudentTests = () => {
  const { selectedImages, setExams, setStudents, setMarks, setAnswers, setFiles, files, setIsAbleNext }
    = useContext(StepperContext)!;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [averageMark, setAverageMark] = useState<number | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [currentProcessing, setCurrentProcessing] = useState<string>("");
  const [unregisteredStudents, setUnregisteredStudents] = useState<{ firstName: string, lastName: string }[]>([]);
  const [hasError, setHasError] = useState<boolean>(false);
  

  const uniqueUnregisteredStudents = useMemo(() => {
    return unregisteredStudents.filter(
      (student, index, self) =>
        index === self.findIndex(
          (s) =>
            s.firstName.trim().toLowerCase() === student.firstName.trim().toLowerCase() &&
            s.lastName.trim().toLowerCase() === student.lastName.trim().toLowerCase()
        )
    );
  }, [unregisteredStudents]);
  // מנע ריצה כפולה בו-זמנית
  const isProcessingRef = useRef(false);
  useEffect(() => {
    const checkTests = async () => {
      if (isProcessingRef.current) return; // אם כבר בעיבוד, לא להריץ שוב
      if (!selectedImages || selectedImages.length === 0) {
        setIsAbleNext(false);
        return;
      }
      isProcessingRef.current = true;
      try {
        setIsLoading(true);
        setProgress(0);
        setUnregisteredStudents([]);
        setHasError(false);
        const allExams: Exam[] = [];
        const allStudents: Student[] = [];
        const allMarks: number[] = [];
        const allAnswers: string[] = [];
        const notRegisteredStudents: { firstName: string, lastName: string }[] = [];
        // יצירת עותק נקי של files כדי לעדכן בצורה תקינה
        const updatedFiles = [...files];
        for (let i = 0; i < selectedImages.length; i++) {
          const selectedImage = selectedImages[i];
          const progressPercentage = Math.round(((i + 1) / selectedImages.length) * 100);
          setProgress(progressPercentage);
          setCurrentProcessing(`Processing exam ${i + 1} of ${selectedImages.length}...`);
          const words = await Analyze(selectedImage);
          const tempExam = extractExam(words);
          const exam = await ExamService.getBySubjectAndDate(tempExam.dateExam, tempExam.subject);
          const answers = extractAnswers(words, exam);
          const student = extractStudent(words);
          const fetchedAnswers = await AnswerService.getByExamId(exam.id);
          let newMark = 100;
          let answer = "";
          const scorePerQuestion = 100 / answers.length;
          fetchedAnswers.forEach((val: Answer) => {
            const match = answers.find(ans => ans.section === val.section);
            if (match && val.correctAnswer !== match.correctAnswer) {
              newMark -= scorePerQuestion;
              answer += `❌ שאלה ${val.section} - התשובה הנכונה היא: ${answers.find(a => a.section === val.section)?.correctAnswer} ●\n`;
            } else {
              answer += `✅ שאלה ${val.section} ●\n`;
            }
          });
          const fileFeedbackName = `feedback_${exam.dateExam.replace(/\s+/g, "_")}.docx`;
          const fileExamName = `${exam.dateExam}`;
          const fullName = `${student.firstName} ${student.lastName}`;
          const url = `exams/student/${student.class}/${fullName}/${exam.subject}`;
          const fileExamUrl = `${url}/${fileExamName}.jpg`;
          const fileFeedbackUrl = `${url}/${fileFeedbackName}`;
          try {
            const studentByName = await StudentService.getByFullNameAndClass(student.class, student.firstName, student.lastName);
            await SubmissionService.create({
              studentId: studentByName.id,
              examId: exam.id,
              score: newMark,
              fileUrl: fileExamUrl,
              fileUrlFeedback: fileFeedbackUrl
            });
            allExams.push(exam);
            allMarks.push(newMark);
            allAnswers.push(answer);
            allStudents.push(student);
          }

          catch (e: any) {
            console.log("the pupil is not exist");
               NotificationService.create({
                        title: "this pupil is not registered",
                        message: "please remember check the pupil's test when she register",
                        type: "info",
                        priority: "high",
                       timestamp: new Date(),
                      });
            // הסר את הקובץ מהקבצים בצורה תקינה
            updatedFiles[i] = null;
            // הוסף לסטודנטים שלא רשומים
            notRegisteredStudents.push({
              firstName: student.firstName,
              lastName: student.lastName
            });
            // שלח מייל
            console.log("Email to send:", student);

            const email = await StudentSheetService.getStudentEmail(student.firstName, student.lastName, student.class);
            console.log("Email to send:", email);
            await EmailService.sendAnEmail(
              ` הי ${student.firstName} ${student.lastName}!`,
              email,
              `
              <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5; color: #333;">
                <h2 style="color: #2c3e50;">שלום וברוך הבא למערכת בדיקת המבחנים שלנו! 📑</h2>
                <p>עליך להירשם בהקדם דרך הקישור הבא:</p>
                <a href="https://checkpoint-client-pi2r.onrender.com"
                   style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
                   מעבר לרישום
                </a>
                <p style="margin-top: 20px;">בהצלחה!<br/>צוות CheckPoint</p>
              </div>
              `
            );
            
            setHasError(true);
          }
        }
        setFiles(updatedFiles);
        setExams(allExams);
        setStudents(allStudents);
        setMarks(allMarks);
        setAnswers(allAnswers);
        setUnregisteredStudents(notRegisteredStudents);
        setIsAbleNext(allExams.length > 0);
        const avg = allMarks.length > 0
          ? parseFloat((allMarks.reduce((a, b) => a + b, 0) / allMarks.length).toFixed(2))
          : null;
        setAverageMark(avg);
        setProgress(100);
        setCurrentProcessing("Processing completed successfully!");
      } catch (err) {
        console.error("שגיאה בבדיקת מבחנים:", err);
        NotificationService.create({
          title: "hoops!",
          message: "error during exam processing, please try again later",
          type: "error",
          priority: "high",
         timestamp: new Date(),
        });
        setHasError(true);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
          isProcessingRef.current = false; // שחרר את הנעילה
        }, 1000);
      }
    };
    checkTests();
  }, [selectedImages, setExams, setStudents, setMarks, setAnswers, setFiles, files, setIsAbleNext]);

  const UnregisteredStudentMessage = ({ students }: { students: { firstName: string, lastName: string }[] }) => (
    <div className="error-container" style={{
      padding: "24px",
      backgroundColor: "#fef2f2",
      borderRadius: "8px",
      border: "1px solid #fecaca",
      marginBottom: "20px",
      textAlign: "center",
      maxWidth: "600px",
      margin: "20px auto"
    }}>
      <div style={{
        display: "flex",
        justifyContent: "center",
        marginBottom: "16px"
      }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" style={{ marginRight: "8px" }}>
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      <h3 style={{
        fontSize: "18px",
        fontWeight: "600",
        color: "#b91c1c",
        marginBottom: "12px"
      }}>
        Registration Error
      </h3>

      {students.map((student, index) => (
        <div key={index} id="exam">
          <p id="exam_p"> The student <strong>{student.firstName} {student.lastName}</strong> is not registered.<br />
            An email with a registration link has been sent to the student.</p>
          <p id="error-msg">A reminder will be sent to you.</p> </div>))}
      <div style={{ marginTop: "20px" }}>
        <Link id="return-home-link" to="/" onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#4338ca"; }}
          onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "#4f46e5"; }} >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: "8px" }}>
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Return to homepage
        </Link>
      </div>
    </div>
  );
  const EnhancedEmptyState = () => (
    <div className="empty-state"   >
      <div className="empty-icon" >
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14,2 14,8 20,8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10,9 9,9 8,9" />
        </svg>
      </div>
      <h3 className="empty-title"
      >No exams submitted for processing</h3>
      <p className="empty-subtitle"  >Upload exam files to begin processing</p>
      <Link id="upload-exams-link" to="/upload" onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#4338ca"; }}
        onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "#4f46e5"; }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: "10px" }}>
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        Upload Exams
      </Link>
    </div>
  );

  return (
    <>
      <Outlet />
      <div className="student-tests-container">
        {isLoading ? (
          <div className="processing-container">
            <div className="processing-card">
              <div className="progress-section">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="progress-text">
                  {currentProcessing} {progress}%
                </div>
              </div>
              <div className="loading-animation">
                <div className="spinner"></div>
              </div>
            </div>
          </div>
        ) : hasError && unregisteredStudents.length > 0 ? (
          // <UnregisteredStudentMessage students={unregisteredStudents} />
          <UnregisteredStudentMessage students={uniqueUnregisteredStudents} />
            
        ) : averageMark !== null ? (
          <div className="completion-container">
            <div className="success-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h2 className="completion-title">Exam processing completed successfully</h2>
            <div className="average-score">
              <span className="score-label">Average Score:</span>
              <span className="score-value">{averageMark}%</span>
            </div>
          </div>
        ) : (
          <EnhancedEmptyState />
        )}
      </div>
    </>
  );
};

export default StudentTests;



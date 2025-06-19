
import { useContext, useEffect, useRef, useState } from "react";
import { ExamService } from "../services/examService";
import { AnswerService } from "../services/answerService";
import { Analyze, extractAnswers, extractExam } from "../utils/ocr";
import StepperContext from "./context/StepperContext";
import "../styles/ResultTests.css";
import { Exam } from "../Types";
import { NotificationService } from "../services/NotificationService";

const ResultTests = () => {
  const { setIsAbleNext } = useContext(StepperContext)!;

  const { selectedImages, setExams } = useContext(StepperContext)!;
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [processedCount, setProcessedCount] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const hasProcessedRef = useRef(false);

  const processAllExams = async () => {
    if (selectedImages.length === 0) return;

    setIsProcessing(true);
    setTotalCount(selectedImages.length);
    setProgress(0);
    setProcessedCount(0);

    const results = await Promise.all(
      selectedImages.map(async (image, index) => {
        try {
          const words = await Analyze(image);
          const exam = extractExam(words);

          const savedExam = await ExamService.create(exam);
console.log("yay")
          const answers = extractAnswers(words, savedExam);
          console.log("answers:", answers);

          await Promise.all(
            answers.map((a) =>
              AnswerService.create(a).catch((e) => {
                console.error("שגיאה ביצירת תשובה:", e);
                return null;
              })
            )
          );
          const savedAnswers = await AnswerService.getByExamId(savedExam.id);

          if (savedAnswers.length !== answers.length) {
            console.warn("מספר תשובות לא תואם, מוחק מבחן...");
            await AnswerService.deleteByExamId(savedExam.id);
            await ExamService.delete(savedExam.id);
              NotificationService.create({
                                    title: "update exam was not successful",
                                    message: "so ,the exam was deleted ,please upload again",
                                    type: "error",
                                    priority: "high",
                                   timestamp: new Date(),
                                  });
            return null;
          }

          // Update progress
          const newProcessedCount = index + 1;
          setProcessedCount(newProcessedCount);
          setProgress((newProcessedCount / selectedImages.length) * 100);

          return savedExam;
        } catch (err) {
          console.error("שגיאה בעיבוד מבחן:", err);

          // Update progress even on error
          const newProcessedCount = index + 1;
          setProcessedCount(newProcessedCount);
          setProgress((newProcessedCount / selectedImages.length) * 100);

          return null;
        }
      })
    );

    const filteredExams = results.filter((exam): exam is Exam => exam !== null);
    setExams(filteredExams);
    console.log("מבחנים שנשמרו:", filteredExams);

    setTimeout(() => {
      setIsProcessing(false);
      setIsCompleted(true);
      setIsAbleNext(true)
    }, 1000);
  };
  // useEffect(() => {
   
  //   if (hasProcessed || selectedImages.length === 0) return;
  //   console.log("r")
  //   setHasProcessed(true);
  //   processAllExams();
  // }, [selectedImages]);

  useEffect(() => {
    if (hasProcessedRef.current || selectedImages.length === 0) return;
    console.log("r")

    hasProcessedRef.current = true;
    processAllExams();
  }, [selectedImages]);
  return (
    <>
      {/* <Outlet /> */}
      <div className="result-tests-container">
        {isProcessing ? (
          <div className="processing-container">
            <div className="processing-card">
              <div className="processing-header">
                <h2 className="processing-title">Processing exams...</h2>
                <div className="processing-counter">
                  {processedCount} of {totalCount} exams processed
                </div>
              </div>

              <div className="progress-section">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="progress-text">
                  {Math.round(progress)}% complete
                </div>
              </div>

              <div className="proces sing-animation">
                <div className="processing-dots">
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
              </div>
            </div>
          </div>
        ) : isCompleted ? (
          <div className="completion-container">
            <div className="success-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h2 className="completion-title">Exam processing completed successfully</h2>
            <p className="completion-subtitle">
              All processable exams have been saved to the system.
            </p>
            <div className="stats-container">
              <div className="stat-item">
                <span className="stat-value">{processedCount}</span>
                <span className="stat-label">Exams Processed</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14,2 14,8 20,8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10,9 9,9 8,9" />
              </svg>
            </div>
            <h3 className="empty-title">Ready to process exams</h3>
            <p className="empty-subtitle">Upload exam files to begin processing</p>
          </div>
        )}
      </div>
    </>
  );
};

export default ResultTests;
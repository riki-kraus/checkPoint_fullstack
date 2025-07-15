
import {Dialog,DialogTitle, DialogContent, Table,TableHead, TableRow, TableCell,TableBody,Button,
    Box,IconButton,DialogActions,Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Visibility, Close, Download, Cancel } from "@mui/icons-material";
import "../styles/student-scores-modal.css";

import {  Student } from "../Types";
import { SubmissionService } from "../services/SubmissionService";
import axiosInstance from "../utils/axiosInstance";
const StudentScoresModal = ({ open, onClose ,currentStudent}: any) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [student, setStudent] = useState<Student | null>(null);
    const [submissions, setSubmissions] = useState<any[]>([]);
    useEffect(() => {
        const fetchData = async () => {
            setStudent(currentStudent);
            const submissionData = await SubmissionService.getByStudentId(Number(currentStudent.id));
            const formatted = Array.isArray(submissionData) ? submissionData : [submissionData];
            setSubmissions(formatted);
        };
        fetchData();
    }, []);

    const openPreview = async (url: string) => {
        try {
            const response = await axiosInstance.get("/upload/download-url", {
                params: { url: encodeURIComponent(url) },
            });
            setPreviewUrl(response.data.url);
        } catch (error) {
            console.error("שגיאה בקבלת הקישור:", error);
        }
    };

    const closePreview = () => {
        setPreviewUrl(null);
    };

    if (!student) return null

    
    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth classes={{ paper: "scores-modal-paper" }}>
                <div className="modal-header">
                    <DialogTitle className="modal-title">
                        <Typography variant="h5" className="student-name">
                            Student grades - {student.firstName} {student.lastName}
                        </Typography>
                    </DialogTitle>
                    <IconButton onClick={onClose} className="close-button">
                        <Close />
                    </IconButton>
                </div>

                <DialogContent className="modal-content-scrollable">
                    <div className="table-container">
                        <Table className="scores-table">
                            <TableHead>
                                <TableRow>
                                    <TableCell className="table-header">View</TableCell>
                                    <TableCell className="table-header">Score</TableCell>
                                    <TableCell className="table-header">Date Exam</TableCell>
                                    <TableCell className="table-header">Subject</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {submissions.map((submission) => {
                                    return (
                                        <TableRow key={submission.id} className="table-row">
                                            <TableCell className="view-cell">
                                                {submission?.file_Url ? (
                                                    <IconButton
                                                        onClick={() => openPreview(submission.file_Url)}
                                                        className="view-button"
                                                    >
                                                        <Visibility />
                                                    </IconButton>
                                                ) : (
                                                    <span className="no-file">-</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="score-cell">{submission.score}</TableCell>

                                            <TableCell className="date-cell">{submission.exam.dateExam}</TableCell>
                                            <TableCell className="subject-cell">{submission.exam.subject}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </DialogContent>

                <DialogActions className="modal-actions">
                    <Button onClick={onClose} className="cancel-button" startIcon={<Cancel />}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={!!previewUrl}
                onClose={closePreview}
                maxWidth="lg"
                fullWidth
                classes={{ paper: "preview-modal-paper" }}
            >
                <div className="preview-header">
                    <DialogTitle className="preview-title">
                        <Typography variant="h5">View test file</Typography>
                    </DialogTitle>
                    <IconButton onClick={closePreview} className="close-button">
                        <Close />
                    </IconButton>
                </div>

                <DialogContent className="preview-content">
                    {previewUrl && (
                        <Box className="preview-container">
                            <img src={previewUrl} alt="preview" className="preview-image" />
                        </Box>
                    )}
                </DialogContent>

                <DialogActions className="preview-actions">
                    <Button onClick={closePreview} className="close-preview-button">
                        Close
                    </Button>
                    {previewUrl && (
                        <a href={previewUrl} download style={{ textDecoration: "none" }}>
                            <Button variant="outlined" className="download-button" startIcon={<Download />}>
                                Upload File
                            </Button>
                        </a>
                    )}
                </DialogActions>
            </Dialog>
        </>
    );
};

export default StudentScoresModal;




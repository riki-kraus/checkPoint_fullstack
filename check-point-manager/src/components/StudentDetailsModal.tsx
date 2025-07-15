

import React, { useState, ChangeEvent, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    IconButton,
    Typography,
    Box,
    Paper,
    InputAdornment
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import ClassIcon from '@mui/icons-material/Class';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Student } from "../Types";
import { StudentService } from "../services/studentService";
import "../styles/StudentDetailsModal.css"

interface StudentModalProps {
     open: boolean;
    onClose: () => void;
    // onSave: (student: Student) => void;
    student?: Student | null;
}


const StudentDetailsModal: React.FC<StudentModalProps> = ({ open, onClose, student }) => {
    const [formData, setFormData] = useState<Student>(student || { id: 0, firstName: "", lastName: "", email: "", class: "",password:"" });
    const [showPassword, setShowPassword] = useState(false)


    useEffect(() => {
        if (student) {
            setFormData(student);
        } else {
            setFormData({ id: 0,firstName: "", lastName: "", email: "", class: "" ,password:""});
        }
    }, [student,open]);



    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async () => {
        try {

            // const url = student ? `${apiUrl}/Student/${student.Id}` : `${apiUrl}/Student`;
            // const method = student ? axios.put : axios.post;
            // await method(url, formData);
            student ? await StudentService.update(student.id!, formData)
                : await StudentService.create(formData);
            await StudentService.getAll();
            onClose();
        } catch (error) {
            console.error("Error submitting student data:", error);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            dir="rtl"
            className="student-dialog"
        >
            <Box className="dialog-header">
                <Typography variant="h5" fontWeight={600} color="#ffffff">
                    {student ? "Edit Student" : "Add New Student"}
                </Typography>
                <IconButton onClick={onClose} size="small" sx={{ color: '#ffffff' }}>
                    <CloseIcon />
                </IconButton>
            </Box>

            <DialogContent sx={{ padding: 0 }}>
                <Box className="content-container">
                    <Paper className="input-container" elevation={0}>
                        {/* <TextField
                            label="ID"
                            name="id"
                            value={formData.id}
                            onChange={handleChange}
                            fullWidth
                            className="styled-input"
                            InputProps={{
                                startAdornment: <BadgeIcon sx={{ mr: 1 }} />,
                            }}
                            disabled={!!student}
                        /> */}
                        <TextField
                            label="FirstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            fullWidth
                            className="styled-input"
                            InputProps={{
                                startAdornment: <PersonIcon sx={{ mr: 1 }} />,
                            }}
                        />
                        <TextField
                            label="LastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            fullWidth
                            className="styled-input"
                            InputProps={{
                                startAdornment: <PersonIcon sx={{ mr: 1 }} />,
                            }}
                        />
                        <TextField
                            label="Class"
                            name="class"
                            value={formData.class}
                            onChange={handleChange}
                            fullWidth
                            className="styled-input"
                            InputProps={{
                                startAdornment: <ClassIcon sx={{ mr: 1 }} />,
                            }}
                        />
                        <TextField
                            label="Gmail"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            fullWidth
                            className="styled-input"
                            InputProps={{
                                startAdornment: <EmailIcon sx={{ mr: 1 }} />,
                            }}
                        />
                     {student == null  &&<TextField
                            label="Password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={handleChange}
                            fullWidth
                            className="styled-input"
                            InputProps={{
                                startAdornment: <LockIcon sx={{ mr: 1 }} />,
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={handleTogglePasswordVisibility}
                                            edge="end"
                                            className="password-visibility-toggle"
                                        >
                                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />}
                    </Paper>
                </Box>
            </DialogContent>

            <DialogActions sx={{ padding: 3, paddingTop: 0, justifyContent: 'flex-start', gap: 2 }}>
                <Button onClick={handleSubmit} variant="contained" className="save-button">
                    Save
                </Button>
                <Button onClick={onClose} className="cancel-button">
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default StudentDetailsModal;
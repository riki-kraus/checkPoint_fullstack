


import { useEffect, useState } from "react"
import { CircularProgress } from "@mui/material"
import { School, Edit, Add, Delete, Download, Search } from "@mui/icons-material"
import StudentDetailsModal from "./StudentDetailsModal"
import StudentScoresModal from "./StudentScoresModal"
import * as XLSX from "xlsx"
import type {  Student, Submission } from "../Types"
import { motion, AnimatePresence } from "framer-motion"
import "../styles/dashboard.css"
import { FileEdit } from "lucide-react";
import { StudentService } from "../services/studentService"
import { SubmissionService } from "../services/SubmissionService"
const Dashboard = () => {

  const [openAddDialog, setOpenAddDialog] = useState(false)
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null)
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false)
  const [openScoresDialog, setOpenScoresDialog] = useState(false)
  const [expandedStudent, setExpandedStudent] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true)



  const fetchData = async () => {
    const response = await StudentService.getAll();
    setStudents(response);
    setFilteredStudents(response);
  };
  
  useEffect(() => {
    const loadData = async () => {
      await fetchData();
      setLoading(false);
    };
    loadData();
  }, []);
  
  useEffect(() => {
    const filtered = students.filter((student) =>
      student.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(student.id).includes(searchQuery) ||
      student.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.class?.toLowerCase().includes(searchQuery)
    );
    setFilteredStudents(filtered);
  }, [searchQuery, students]);

const exportToExcel = async () => {
  const data: any[] = [];

  const allSubmissions = await Promise.all(
    filteredStudents.map(student => SubmissionService.getByStudentId(student.id!))
  );

  filteredStudents.forEach((student, index) => {
    const submissions = allSubmissions[index];
    submissions.forEach((submission:Submission) => {
      data.push({
        "Student ID": student.id,
        "Student Name": `${student.firstName} ${student.lastName}`,
        "Class": student.class,
        "Email": student.email,
        "Exam": submission?.exam?.subject ,
        "Exam Date": submission?.exam?.dateExam ,
        "Score": submission?.score, // nullish coalescing for 0 or null
      });
    });
  });
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Students Scores");
  XLSX.writeFile(workbook, "students_scores.xlsx");
};


  
  const toggleExpandStudent = (studentId: number) => {
    setExpandedStudent(prev => (prev === studentId ? null : studentId))
  }

  if (loading) {
    // setInterval(()=>{},100000)
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <motion.div
            initial={{ opacity: 0, scale: 0.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.1 }}
            className="loading-icon-container"
          >
            <CircularProgress className="loading-spinner" />
            <div className="loading-glow"></div>
          </motion.div>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="loading-text"
          >
            Loading student data...
          </motion.h3>
        </div>
      </div>
    )
  }
  else {

return (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="student-dashboard">
      <div className="dashboard-header">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }} className="dashboard-title">
              <School className="dashboard-icon" />
              <h1>Student Management</h1>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, duration: 0.5 }} className="dashboard-actions">
              <motion.button whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(79, 224, 182, 0.5)" }} whileTap={{ scale: 0.95 }} className="action-button add-button" onClick={() => {setOpenAddDialog (true) ;setCurrentStudent(null);}}>
                  <Add className="button-icon" />
                  <span>Add Student</span>
              </motion.button>
              <motion.button whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(79, 224, 182, 0.3)" }} whileTap={{ scale: 0.95 }} className="action-button export-button" onClick={exportToExcel}>
                  <Download className="button-icon" />
                  <span>Export to Excel</span>
              </motion.button>
          </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }} className="search-filter-container">
          <div className="search-container">
              <Search className="search-icon" />
              <input
                  type="text"
                  placeholder="Search by name, ID, class or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
              />
          </div>
        
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.5 }} className="students-table-container">
          <div className="students-table-header">
              <div className="header-cell header-id">ID</div>
              <div className="header-cell header-name">Name</div>
              <div className="header-cell header-class">Class</div>
          <div className="header-cell header-email">Email</div>
          </div>

          <AnimatePresence>
              {filteredStudents.length === 0 ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="no-results">
                      <div className="no-results-content">
                          <Search className="no-results-icon" />
                          <h3>No students found</h3>
                          <p>Try changing the filters or search term</p>
                      </div>
                  </motion.div>
              ) : (
                  <div className="students-table-body">
                      {filteredStudents.map((student, index) => (
                        
                        <motion.div
                              key={student.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ delay: index * 0.05, duration: 0.3 }}
                              layout
                          >
                              <motion.div
                                  className={`student-row ${expandedStudent === student.id ? "expanded" : ""}`}
                                  whileHover={{ backgroundColor: "rgba(79, 224, 182, 0.05)" }}
                                  onClick={() => toggleExpandStudent(student.id!)}
                              >
                                  <div className="student-cell student-id">{student.id}</div>
                                  <div className="student-cell">{student.firstName} {student.lastName}</div>
                                  <div className="student-cell student-class">{student.class}</div>
                                <div className="student-cell student-email">{student.email}</div>
                                  <div className="student-cell student-actions" onClick={(e) => e.stopPropagation()}>
                                      <motion.button className="action-icon-button edit-scores"
                                        onClick={() => {
                                          setCurrentStudent(student)
                                          setOpenScoresDialog(true);

                                      }} title="Edit Student Scores">

                                        
                                          <FileEdit />
                                      </motion.button>

                                      <motion.button className="action-icon-button edit-details" onClick={() => {
                                          setCurrentStudent (student)
                                          setOpenDetailsDialog(true) 
                                      }} title="Edit Student Details">
                                          <Edit />
                                      </motion.button>
                                      <motion.button className="action-icon-button delete" onClick={async () => {
  await StudentService.delete(student.id!);
  fetchData(); // או שתסנני ידנית מהסטייט
}}
 title="Delete Student">
                                          <Delete />
                                      </motion.button>
                                  </div>
                              </motion.div>

                              <AnimatePresence>
                                  {expandedStudent === student.id && (
                                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="expanded-content">
                                          <div className="expanded-actions">
                                              <motion.button className="expanded-action-button edit-scores-button" onClick={() => {
                                                  setCurrentStudent  (student)
                                                  setOpenScoresDialog  (true)
                                              }}>
                                                  <FileEdit className="button-icon" />
                                                  <span>Edit Scores</span>
                                              </motion.button>
                                              <motion.button className="expanded-action-button edit-details-button" onClick={() => {
                                                  setCurrentStudent (student)
                                                 setOpenDetailsDialog (true)
                                              }}>
                                                  <Edit className="button-icon" />
                                                  <span>Edit Details</span>
                                              </motion.button>
                                              <motion.button className="expanded-action-button delete-button" onClick={async () => {
  await StudentService.delete(student.id!);
  fetchData(); // או שתסנני ידנית מהסטייט
}}
>
                                                  <Delete className="button-icon" />
                                                  <span>Delete Student</span>
                                              </motion.button>
                                          </div>

                                          <div className="student-details">
                                              <div className="detail-group">
                                                  <div className="detail-label">Student ID:</div>
                                                  <div className="detail-value">{student.id}</div>
                                              </div>
                                              <div className="detail-group">
                                                  <div className="detail-label">Full Name:</div>
                                                  <div className="detail-value">{student.firstName}</div>
                                              </div>
                                              <div className="detail-group">
                                                  <div className="detail-label">Class:</div>
                                                  <div className="detail-value">{student.class}</div>
                                              </div>
                                              <div className="detail-group">
                                                  <div className="detail-label">Email:</div>
                                                  <div className="detail-value">{student.email}</div>
                                              </div>
                                              <div className="detail-group">
                                                  <div className="detail-label">Password:</div>
                                                  {/* <div className="detail-value">{student.password}</div> */}
                                              </div>
                                          </div>
                                      </motion.div>
                                  )}
                              </AnimatePresence>
                          </motion.div>
                      ))}
                  </div>
              )}
          </AnimatePresence>
      </motion.div>

      {/* <StudentDetailsModal open={openAddDialog} onClose={() => (setOpenAddDialog (false) )} /> */}
      {/* // onSave={studentStore.addStudent} /> */}
      {/* <StudentScoresModal open={!!currentStudent && openScoresDialog} onClose={() => {
         setCurrentStudent (null) 
          setOpenScoresDialog (false) 
      }} onSave={null} student={currentStudent} />
       */}

{openScoresDialog && currentStudent && (
    <StudentScoresModal
        open={openScoresDialog}
        onClose={() => {
            setOpenScoresDialog(false);
            setCurrentStudent(null); // איפוס סטודנט בסגירה
        }}
        currentStudent={currentStudent}
    />
)}
      
  <StudentDetailsModal 
    open={openAddDialog} 
    onClose={async () => {
      setCurrentStudent(null)
      setOpenAddDialog(false);
      const updatedStudents = await StudentService.getAll();
      setFilteredStudents(updatedStudents);
    }} 
  />

      <StudentDetailsModal open={openDetailsDialog} onClose={async () => { setOpenDetailsDialog(false); setCurrentStudent(null);       const updatedStudents = await StudentService.getAll();
      setFilteredStudents(updatedStudents);}} student={currentStudent} />
      {/* onSave={studentStore.addStudent}  /> */}
  </motion.div>
  
)
}
}
export default Dashboard
//studentStore.updateStudent
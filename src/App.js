import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css"; // Import the CSS file for styling

function App() {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({
    rollNumber: "",
    name: "",
    wallet: "",
  });

  useEffect(() => {
    fetchCourses();
    fetchStudents();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get("http://localhost:8000/courses");
      setCourses(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get("http://localhost:8000/students");
      setStudents(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (e) => {
    setNewStudent({ ...newStudent, [e.target.name]: e.target.value });
  };

  const addStudent = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5500/students", newStudent);
      fetchStudents();
      setNewStudent({
        rollNumber: "",
        name: "",
        wallet: "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Student Record System</h1>

      <div className="section">
        <h2>Courses</h2>
        {courses.map((course) => (
          <div key={course.id} className="course">
            <p className="course-name">Name: {course.name}</p>
            <p className="course-cgpa">
              Contributes to CGPA: {course.contributesToCGPA.toString()}
            </p>
            <p className="course-marks">Total Marks: {course.totalMarks}</p>
          </div>
        ))}
      </div>

      <div className="section">
        <h2>Students</h2>
        {students.map((student) => (
          <div key={student.wallet} className="student">
            <p className="student-roll">Roll Number: {student.rollNumber}</p>
            <p className="student-name">Name: {student.name}</p>
            <p className="student-cgpa">CGPA: {student.cgpa}</p>
            <p className="student-wallet">Wallet: {student.wallet}</p>
          </div>
        ))}
      </div>

      <div className="section">
        <h2>Add Student</h2>
        <form className="add-student-form" onSubmit={addStudent}>
          <label>
            Roll Number:
            <input
              type="text"
              name="rollNumber"
              value={newStudent.rollNumber}
              onChange={handleInputChange}
            />
          </label>
          <br />
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={newStudent.name}
              onChange={handleInputChange}
            />
          </label>
          <br />
          <label>
            Wallet:
            <input
              type="text"
              name="wallet"
              value={newStudent.wallet}
              onChange={handleInputChange}
            />
          </label>
          <br />
          <button type="submit">Add Student</button>
        </form>
      </div>
    </div>
  );
}

export default App;

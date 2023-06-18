import React, { useState, useEffect } from "react";
import axios from "axios";

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
      await axios.post("http://localhost:8000/students", newStudent);
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
    <div>
      <h1>Student Record System</h1>

      <h2>Courses</h2>
      {courses.map((course) => (
        <div key={course.id}>
          <p>Name: {course.name}</p>
          <p>Contributes to CGPA: {course.contributesToCGPA.toString()}</p>
          <p>Total Marks: {course.totalMarks}</p>
          <hr />
        </div>
      ))}

      <h2>Students</h2>
      {students.map((student) => (
        <div key={student.wallet}>
          <p>Roll Number: {student.rollNumber}</p>
          <p>Name: {student.name}</p>
          <p>CGPA: {student.cgpa}</p>
          <p>Wallet: {student.wallet}</p>
          <hr />
        </div>
      ))}

      <h2>Add Student</h2>
      <form onSubmit={addStudent}>
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
  );
}

export default App;

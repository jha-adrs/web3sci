//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract StudentRecordSystem {
    address admin;
    uint public totalCourses;

    struct Course {
        string name;
        bool contributesToCGPA;
        uint totalMarks;
    }

    struct Student {
        uint rollNumber;
        string name;
        uint cgpa;
        address wallet;
    }

    struct Faculty {
        uint employeeId;
        string name;
        address wallet;
    }
    struct Guest {
        uint guestId;
        string name;
        address wallet;
        bool whitelisted;
    }

    mapping(uint => Course) public courses;
    mapping(address => Student) public students;
    mapping(address => Faculty) public faculties;
    mapping(address => Guest) public guests; // The allowed people to check records
    //Guests allowed to check specific student records
    mapping(address => Student[]) public guestStudents;
    //Guests allowed to check specific faculty records
    mapping(address => Faculty[]) public guestFaculties;

    constructor() {
        admin = msg.sender;
        totalCourses = 0;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this operation.");
        _;
    }

    modifier onlyStudent() {
        require(
            students[msg.sender].rollNumber != 0,
            "Only students can perform this operation."
        );
        _;
    }

    modifier onlyFaculty() {
        require(
            faculties[msg.sender].employeeId != 0,
            "Only faculty members can perform this operation."
        );
        _;
    }

    function addCourse(
        string memory _name,
        bool _contributesToCGPA,
        uint _numberOfComponents
    ) public onlyAdmin {
        uint courseId = totalCourses + 1;
        courses[courseId] = Course(
            _name,
            _contributesToCGPA,
            _numberOfComponents
        );
        totalCourses++;
    }

    // Adds a new student to the whitelist
    function addWalletForStudent(
        address _studentAddress,
        uint _rollNumber,
        string memory _name
    ) public onlyAdmin {
        require(
            students[_studentAddress].rollNumber == 0,
            "Wallet already exists for this student."
        );
        students[_studentAddress] = Student(
            _rollNumber,
            _name,
            0,
            _studentAddress
        );
    }

    function addWalletForFaculty(
        address _facultyAddress,
        uint _employeeId,
        string memory _name
    ) public onlyAdmin {
        require(
            faculties[_facultyAddress].employeeId == 0,
            "Wallet already exists for this faculty member."
        );
        faculties[_facultyAddress] = Faculty(
            _employeeId,
            _name,
            _facultyAddress
        );
    }

    function uploadMarks(
        uint _rollNumber,
        uint _courseId,
        uint _marks
    ) public onlyFaculty {
        require(
            courses[_courseId].contributesToCGPA,
            "This course does not contribute to CGPA."
        );
        require(
            students[msg.sender].rollNumber != 0,
            "Invalid faculty member."
        );
        require(_marks <= courses[_courseId].totalMarks, "Invalid marks.");


        address studentAddress;
        for (uint i = 0; i <= totalCourses; i++) {
            if (students[msg.sender].rollNumber == _rollNumber) {
                studentAddress = msg.sender;
                break;
            }
        }

        require(studentAddress != address(0), "Invalid student roll number.");
        students[studentAddress].cgpa += _marks;
    }

    function getStudentDetails(
        address _studentAddress
    ) public view returns (uint, string memory, uint, address) {
        require(
            students[_studentAddress].rollNumber != 0,
            "Invalid student address."
        );
        Student memory student = students[_studentAddress];
        return (student.rollNumber, student.name, student.cgpa, student.wallet);
    }

    function getFacultyDetails(
        address _facultyAddress
    ) public view returns (uint, string memory, address) {
        require(
            faculties[_facultyAddress].employeeId != 0,
            "Invalid faculty address."
        );
        Faculty memory faculty = faculties[_facultyAddress];
        return (faculty.employeeId, faculty.name, faculty.wallet);
    }
}

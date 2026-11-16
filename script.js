const registrationForm =
document.getElementById("registration-form");

let students =
JSON.parse(localStorage.getItem("students")) 

function calculateGrade(marks) {

    if (marks >= 80) {
        return "Excellent";
    } else if (marks >= 70) {
        return "Very Good";
    } else if (marks >= 60) {
        return "Good";
    } else if (marks >= 50) {
        return "Average"
    } else {
        return "Failed";
    }

}

function displayStudents(studentList=students) {
   const records =
   document.getElementById("student-records");
   const emptyRecords=
   document.getElementById("empty-records")

   if(!records || !emptyRecords) return;

   records.innerHTML ="";
   if(studentList.length === 0) {
    emptyRecords.textContent = students.length === 0
    ?"No students have been registered yet."
    :"No matching studebts found";

    emptyRecords.style.display = "block"; return;

   }

   emptyRecords.style.display = "none";
   studentList.forEach(function(student){

    const row = document.createElement("tr");

    const values = [
        student.name,
        student.email,
        student.course,
        student.age,
        student.gender,
        student.marks + "%",
        calculateGrade(student.marks)
    ];

    values.forEach(function(value){

        const cell = document.createElement("td");
        cell.textContent = value;
        row.appendChild(cell);
        
    });

    records.appendChild(row);

   });

}



// =====================================
// FUNCTION 3: UPDATE DASHBOARD STATISTICS
// =====================================

function updateStatistics() {

    const total = students.length;

    const totalMarks = students.reduce(function(sum, student) {
        return sum + student.marks;
    }, 0);

    const average = total > 0 ? totalMarks / total : 0;

    const passed = students.filter(function(student) {
        return student.marks >= 50;
    }).length;

    const highest = total > 0
        ? Math.max(...students.map(student => student.marks))
        : 0;

    const lowest = total > 0
        ? Math.min(...students.map(student => student.marks))
        : 0;

    const passRate = total > 0
        ? (passed / total) * 100
        : 0;


    // Dashboard statistics

    document.getElementById("total-students").textContent = total;

    document.getElementById("average-marks").textContent =
        average.toFixed(1) + "%";

    document.getElementById("passed-students").textContent = passed;


    // Performance summary

    document.getElementById("performance-average").textContent =
        average.toFixed(1) + "%";

    document.getElementById("highest-marks").textContent =
        highest + "%";

    document.getElementById("lowest-marks").textContent =
        lowest + "%";

    document.getElementById("pass-rate").textContent =
        passRate.toFixed(1) + "%";

}


// =====================================
// FUNCTION 4: REGISTER A NEW STUDENT
// =====================================

if (registrationForm) {

    registrationForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const name = document.getElementById("student-name").value.trim();

        const email = document.getElementById("student-email").value.trim();

        const course = document.getElementById("student-course").value;

        const marksInput = document.getElementById("student-marks").value;

        const marks = Number(marksInput);

        const error = document.getElementById("registration-error");

        const success = document.getElementById("registration-success");

        error.textContent = "";
        success.textContent = "";


        // Check empty fields

        if (name === "" || email === "" || course === "" || marksInput === "") {

            error.textContent = "Please fill in all fields.";
            return;

        }


        // Check email format

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {

            error.textContent = "Please enter a valid email address.";
            return;

        }


        // Check marks

        if (!Number.isFinite(marks) || marks < 0 || marks > 100) {

            error.textContent = "Marks must be between 0 and 100.";
            return;

        }


        // Prevent duplicate email addresses

        const duplicate = students.some(function(student) {
            return student.email.toLowerCase() === email.toLowerCase();
        });

        if (duplicate) {

            error.textContent = "This email is already registered.";
            return;

        }


        // Generate student ID

        const student = {

            id: "TA" + String(students.length + 1).padStart(3, "0"),
            name: name,
            email: email,
            course: course,
            marks: marks

        };


        // Add student to the array

        students.push(student);


        // Save records in localStorage

        localStorage.setItem("students", JSON.stringify(students));


        // Display updated information

        displayStudents();
        updateStatistics();


        // Display success message

        success.textContent = "Student registered successfully!";


        // Clear the form

        registrationForm.reset();

    });

}


// =====================================
// FUNCTION 5: SEARCH FOR STUDENTS
// =====================================

const searchInput = document.getElementById("student-search");

if (searchInput) {

    searchInput.addEventListener("input", function() {

        const searchValue = searchInput.value.toLowerCase().trim();

        const filteredStudents = students.filter(function(student) {

            return student.name.toLowerCase().includes(searchValue) ||
                   student.email.toLowerCase().includes(searchValue) ||
                   student.course.toLowerCase().includes(searchValue);

        });

        displayStudents(filteredStudents);

    });

}


// =====================================
// INITIALIZE DASHBOARD
// =====================================

if (registrationForm) {

    displayStudents();
    updateStatistics();

}
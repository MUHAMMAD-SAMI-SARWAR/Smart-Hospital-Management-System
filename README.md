# 🏥 Medical Center | Smart Hospital Management System

A futuristic, full-stack medical dashboard built to streamline hospital operations. This system manages patient registrations, doctor availability, and appointment scheduling with a real-time responsive UI.

---

## 🚀 Key Features
- **📊 Interactive Dashboard:** Live tracking of total patients and doctor statuses.
- **🧬 Patient Portal:** Register patients with detailed disease tracking.
- **👨‍⚕️ Doctor Management:** Specialization-based doctor registration and auto-availability updates.
- **📅 Smart Booking:** Conflict-free appointment scheduling system.
- **🌌 Cyberpunk UI:** Glassmorphism design with neon-glow aesthetics and mobile responsiveness.

---

## 🛠️ Tech Stack
- **Frontend:** HTML5, CSS3 (Custom Variables & Grid), JavaScript (ES6+)
- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **Icons:** FontAwesome 6.0

---

## 📂 Project Structure
```text
Sami-Medical-Center/
├── index.html       # Main Dashboard UI
├── style.css        # Custom Cyberpunk Styles
├── script.js        # Frontend Logic & API Integration
├── index.js         # Express Backend Server
├── db.js            # MySQL Database Connection
├── package.json     # Node Dependencies
└── README.md        # Project Documentation
⚙️ Installation & Setup1. PrerequisitesInstall Node.jsInstall MySQL Server2. Database SetupLogin to your MySQL and run the following commands:SQLCREATE DATABASE hospital_db;
USE hospital_db;

-- Patients Table
CREATE TABLE Patients (
    PatientID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100) NOT NULL,
    Age INT,
    ContactNumber VARCHAR(20),
    Disease VARCHAR(100)
);

-- Doctors Table
CREATE TABLE Doctors (
    DoctorID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100) NOT NULL,
    Specialization VARCHAR(100),
    Phone VARCHAR(20),
    IsAvailable BOOLEAN DEFAULT 1
);

-- Appointments Table
CREATE TABLE Appointments (
    AppointmentID INT PRIMARY KEY AUTO_INCREMENT,
    PatientID INT,
    DoctorID INT,
    AppointmentDate DATE,
    Status ENUM('Scheduled', 'Completed') DEFAULT 'Scheduled',
    FOREIGN KEY (PatientID) REFERENCES Patients(PatientID),
    FOREIGN KEY (DoctorID) REFERENCES Doctors(DoctorID)
);
3. Backend ConfigurationUpdate your MySQL credentials in db.js:JavaScriptconst db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "YOUR_PASSWORD", // Enter your MySQL password here
    database: "hospital_db"
});
4. Running the ProjectBash# Install dependencies
npm install express mysql2 cors

# Start the server
node index.js
Now, open index.html in your browser.
👤 AuthorSamiFull Stack Developer & Student

const express = require('express');
const db = require('./db');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

// Stats for Dashboard
app.get('/stats', (req, res) => {
    const sql = `
        SELECT 
            (SELECT COUNT(*) FROM Patients) as totalPatients,
            (SELECT COUNT(*) FROM Doctors WHERE IsAvailable = 1) as availableDocs,
            (SELECT COUNT(*) FROM Doctors WHERE IsAvailable = 0) as busyDocs
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results[0]);
    });
});

// --- PATIENTS ---
app.post('/add-patient', (req, res) => {
    const { name, age, contact, disease } = req.body;
    if(!name || !age || !contact || !disease) return res.status(400).json({message: "Fields cannot be empty"});
    
    const sql = "INSERT INTO Patients (Name, Age, ContactNumber, Disease) VALUES (?, ?, ?, ?)";
    db.query(sql, [name, age, contact, disease], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Success" });
    });
});

app.get('/patients', (req, res) => {
    db.query("SELECT * FROM Patients", (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

app.delete('/delete-patient/:id', (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM Appointments WHERE PatientID = ?", [id], (err) => {
        db.query("DELETE FROM Patients WHERE PatientID = ?", [id], (err) => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Deleted" });
        });
    });
});

// --- DOCTORS ---
app.post('/add-doctor', (req, res) => {
    const { name, specialization, phone } = req.body;
    if(!name || !specialization || !phone) return res.status(400).json({message: "Fields cannot be empty"});

    db.query("INSERT INTO Doctors (Name, Specialization, Phone, IsAvailable) VALUES (?, ?, ?, 1)", [name, specialization, phone], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Success" });
    });
});

app.get('/available-doctors', (req, res) => {
    db.query("SELECT * FROM Doctors", (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

app.delete('/delete-doctor/:id', (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM Doctors WHERE DoctorID = ?", [id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Doctor Removed" });
    });
});

// --- APPOINTMENTS ---
app.post('/book-appointment', (req, res) => {
    const { patientId, doctorId, appointmentDate } = req.body;
    db.query("INSERT INTO Appointments (PatientID, DoctorID, AppointmentDate) VALUES (?, ?, ?)", [patientId, doctorId, appointmentDate], (err) => {
        if (err) return res.status(500).json(err);
        db.query("UPDATE Doctors SET IsAvailable = 0 WHERE DoctorID = ?", [doctorId]);
        res.json({ message: "Success" });
    });
});

app.get('/appointments', (req, res) => {
    const sql = `
        SELECT a.AppointmentID, p.Name as PatientName, d.Name as DoctorName, d.DoctorID, a.AppointmentDate, a.Status, p.Disease
        FROM Appointments a
        JOIN Patients p ON a.PatientID = p.PatientID
        JOIN Doctors d ON a.DoctorID = d.DoctorID
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

app.put('/update-appointment/:id', (req, res) => {
    const { id } = req.params;
    const { status, doctorId } = req.body;
    db.query("UPDATE Appointments SET Status = ? WHERE AppointmentID = ?", [status, id], (err) => {
        if (status === 'Completed') {
            db.query("UPDATE Doctors SET IsAvailable = 1 WHERE DoctorID = ?", [doctorId]);
        }
        res.json({ message: "Updated" });
    });
});

app.delete('/delete-appointment/:id/:docId', (req, res) => {
    const { id, docId } = req.params;
    db.query("DELETE FROM Appointments WHERE AppointmentID = ?", [id], (err) => {
        db.query("UPDATE Doctors SET IsAvailable = 1 WHERE DoctorID = ?", [docId]);
        res.json({ message: "Deleted" });
    });
});

app.listen(3000, () => console.log("Server running on 3000"));
const API_URL = "http://localhost:3000";

async function updateDashboard() {
    const res = await fetch(`${API_URL}/stats`);
    const data = await res.json();
    document.getElementById('total-pts').innerText = data.totalPatients || 0;
    document.getElementById('avail-docs').innerText = data.availableDocs || 0;
    document.getElementById('busy-docs').innerText = data.busyDocs || 0;
}

function showTab(tabId) {
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    
    if(tabId === 'appointments') {
        loadPatientSelect();
        loadAvailableDoctors();
        loadAppointments();
    } else if(tabId === 'patients') {
        loadPatientList();
    } else if(tabId === 'doctors') {
        loadDoctorList();
    }
    updateDashboard();
}

async function loadDoctorList() {
    const res = await fetch(`${API_URL}/available-doctors`);
    const data = await res.json();
    const body = document.getElementById('doctorListBody');
    body.innerHTML = data.map(d => `
        <tr>
            <td>${d.DoctorID}</td>
            <td>${d.Name || '---'}</td>
            <td>${d.Specialization || '---'}</td>
            <td><span class="status-badge status-${d.IsAvailable ? 'Completed' : 'Scheduled'}">${d.IsAvailable ? 'Free' : 'Busy'}</span></td>
            <td><button onclick="removeDoctor(${d.DoctorID})" style="background:#ff4d4d; color:white; border:none; border-radius:4px; cursor:pointer; padding:4px 8px;">Delete</button></td>
        </tr>
    `).join('');
}

async function removeDoctor(id) {
    if(!confirm("Delete this doctor?")) return;
    await fetch(`${API_URL}/delete-doctor/${id}`, { method: 'DELETE' });
    loadDoctorList();
    updateDashboard();
}

async function loadPatientList() {
    const res = await fetch(`${API_URL}/patients`);
    const data = await res.json();
    const body = document.getElementById('patientListBody');
    body.innerHTML = data.map(p => `
        <tr>
            <td>${p.PatientID}</td>
            <td>${p.Name}</td>
            <td>${p.Disease}</td>
            <td><button onclick="removePatient(${p.PatientID})" style="background:#ff4d4d; color:white; border:none; border-radius:4px; padding:4px 8px;">Remove</button></td>
        </tr>
    `).join('');
}

async function removePatient(id) {
    if(!confirm("Delete patient?")) return;
    await fetch(`${API_URL}/delete-patient/${id}`, { method: 'DELETE' });
    loadPatientList();
    updateDashboard();
}

async function loadAvailableDoctors() {
    const res = await fetch(`${API_URL}/available-doctors`);
    const data = await res.json();
    const select = document.getElementById('a-did');
    select.innerHTML = '<option value="">-- Choose Doctor --</option>' + 
        data.filter(d => d.IsAvailable).map(d => `<option value="${d.DoctorID}">${d.Name} (${d.Specialization})</option>`).join('');
}

async function loadPatientSelect() {
    const res = await fetch(`${API_URL}/patients`);
    const data = await res.json();
    const select = document.getElementById('a-pname');
    select.innerHTML = '<option value="">-- Choose Patient --</option>' + 
        data.map(p => `<option value="${p.PatientID}">${p.Name}</option>`).join('');
}

async function addDoctor() {
    const name = document.getElementById('d-name').value;
    const specialization = document.getElementById('d-spec').value;
    const phone = document.getElementById('d-phone').value;

    if(!name || !specialization || !phone) return alert("Please fill all fields!");

    await fetch(`${API_URL}/add-doctor`, {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name, specialization, phone})
    });
    document.querySelectorAll('#doctors input').forEach(i => i.value = '');
    loadDoctorList();
    updateDashboard();
}

// ... Patient and Appointment booking functions remain same as last version
async function addPatient() {
    const name = document.getElementById('p-name').value;
    const age = document.getElementById('p-age').value;
    const disease = document.getElementById('p-disease').value;
    const contact = document.getElementById('p-contact').value;
    if(!name || !age || !disease || !contact) return alert("Fill all fields!");
    await fetch(`${API_URL}/add-patient`, {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name, age, disease, contact})
    });
    document.querySelectorAll('#patients input').forEach(i => i.value = '');
    loadPatientList();
    updateDashboard();
}

async function bookAppointment() {
    const patientId = document.getElementById('a-pname').value;
    const doctorId = document.getElementById('a-did').value;
    const date = document.getElementById('a-date').value;
    if(!patientId || !doctorId || !date) return alert("Fill all details!");
    await fetch(`${API_URL}/book-appointment`, {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({patientId, doctorId, appointmentDate: date})
    });
    loadAppointments();
    updateDashboard();
}

async function loadAppointments() {
    const res = await fetch(`${API_URL}/appointments`);
    const data = await res.json();
    const body = document.getElementById('apptBody');
    body.innerHTML = data.map(a => `
        <tr>
            <td>${a.AppointmentID}</td>
            <td>${a.PatientName}</td>
            <td>${a.Disease}</td>
            <td>${a.DoctorName}</td>
            <td>${new Date(a.AppointmentDate).toLocaleDateString()}</td>
            <td><span class="status-badge status-${a.Status}">${a.Status}</span></td>
            <td>
                <button onclick="completeAppt(${a.AppointmentID}, ${a.DoctorID})" style="background:#10b981; color:white; border:none; padding:4px 8px; border-radius:4px;">Done</button>
                <button onclick="deleteBooking(${a.AppointmentID}, ${a.DoctorID})" style="background:#64748b; color:white; border:none; padding:4px 8px; border-radius:4px;">Delete</button>
            </td>
        </tr>
    `).join('');
}

async function completeAppt(id, docId) {
    await fetch(`${API_URL}/update-appointment/${id}`, {
        method: 'PUT', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ status: 'Completed', doctorId: docId })
    });
    loadAppointments();
    updateDashboard();
}

async function deleteBooking(id, docId) {
    await fetch(`${API_URL}/delete-appointment/${id}/${docId}`, { method: 'DELETE' });
    loadAppointments();
    updateDashboard();
}

showTab('patients');
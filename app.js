// ข้อมูลตัวอย่างนัดหมาย
const appointments = [
    {
        id: 1,
        doctor: 1,
        patient: "ผู้ป่วย 6401023",
        time: "10:00 - 11:00",
        room: "101",
        contact: "095-446-028",
        revenue: 500,
        date: "2024-10-22" // วันที่นัดหมาย
    },
    {
        id: 2,
        doctor: 2,
        patient: "ผู้ป่วย 6401045",
        time: "11:00 - 12:00",
        room: "102",
        contact: "095-446-555",
        revenue: 700,
        date: "2024-10-22" // วันที่นัดหมาย
    },
    {
        id: 3,
        doctor: "special",
        patient: "ผู้ป่วยพิเศษ",
        time: "13:00 - 14:00",
        room: "ห้องพิเศษ 1",
        contact: "095-446-999",
        revenue: 1000,
        date: "2024-10-22" // วันที่นัดหมาย
    }
];

// ข้อมูลแอดมินตามแพทย์
const adminData = {
    1: { name: "นางสาวสุนีย์", phone: "095-123-4567", email: "admin1@example.com" },
    2: { name: "นายสมชาย", phone: "095-223-4567", email: "admin2@example.com" },
    3: { name: "นางสาวเจน", phone: "095-323-4567", email: "admin3@example.com" },
    special: { name: "นางสาวพิเศษ", phone: "095-423-4567", email: "admin_special@example.com" },
};

// ฟังก์ชันสำหรับแสดงรายละเอียดการนัดหมายใน modal
let currentAppointmentId = null;

function showAppointmentDetails(appointment) {
    const modalDetails = document.getElementById('modalDetails');
    modalDetails.innerHTML = ` 
        <p><strong>ชื่อผู้ป่วย:</strong> ${appointment.patient}</p>
        <p><strong>เวลา:</strong> ${appointment.time}</p>
        <p><strong>ห้อง:</strong> ${appointment.room}</p>
        <p><strong>เบอร์ติดต่อ:</strong> ${appointment.contact}</p>
        <p><strong>รายได้:</strong> ${appointment.revenue} บาท</p>
        <p><strong>วันที่นัดหมาย:</strong> ${appointment.date}</p>
    `;
    currentAppointmentId = appointment.id; // เก็บ ID ของนัดหมายปัจจุบัน
}

// ฟังก์ชันสำหรับอัปเดตข้อมูลแอดมิน
function updateAdminInfo(doctorId) {
    const adminInfoList = document.getElementById('adminInfoList');
    const adminName = document.getElementById('adminName');
    const adminPhone = document.getElementById('adminPhone');
    const adminEmail = document.getElementById('adminEmail');

    // เปลี่ยนข้อมูลแอดมินตามแพทย์ที่เลือก
    const admin = adminData[doctorId] || { name: "ข้อมูลไม่พบ", phone: "", email: "" };

    adminName.textContent = admin.name;
    adminPhone.textContent = admin.phone;
    adminEmail.textContent = admin.email;
}

// ฟังก์ชันสำหรับแสดงรายการนัดหมายตามหมอและวันที่
function updateAppointments() {
    const doctorId = document.getElementById('doctorFilter').value;
    const selectedDate = document.getElementById('dateFilter').value;
    const appointmentList = document.getElementById('appointmentList');
    const summaryList = document.getElementById('summaryList');
    const totalRevenue = document.getElementById('totalRevenue');
    const paymentAmount = document.getElementById('paymentAmount');
    let total = 0;
    let totalPayment = 0;

    // ล้างรายการเดิม
    appointmentList.innerHTML = '';
    summaryList.innerHTML = '';

    // กรองการนัดหมายตามหมอที่เลือกและวันที่
    const filteredAppointments = appointments.filter(app => 
        (app.doctor == doctorId || doctorId == "") &&
        (app.date == selectedDate || selectedDate == "")
    );

    // แสดงรายการนัดหมายที่กรอง
    filteredAppointments.forEach(app => {
        const timeSlot = document.createElement('div');
        timeSlot.className = 'time-slot mb-3';
        timeSlot.setAttribute('data-bs-toggle', 'modal');
        timeSlot.setAttribute('data-bs-target', '#appointmentModal');
        timeSlot.setAttribute('data-id', app.id);
        
        // ฟังเหตุการณ์เมื่อเปิด modal
        timeSlot.addEventListener('click', () => showAppointmentDetails(app));

        timeSlot.innerHTML = `
            <div class="d-flex justify-content-between">
                <span>${app.time}</span>
                <span class="badge bg-success">นัดหมาย</span>
            </div>
            <div class="appointment bg-warning p-2 mt-2">
                <strong>${app.patient}</strong> <br>
                ห้อง: ${app.room} <br>
                เบอร์ติดต่อ: ${app.contact}
            </div>
        `;
        appointmentList.appendChild(timeSlot);

        // อัปเดตสรุปนัดหมาย
        const summaryItem = document.createElement('li');
        summaryItem.className = 'list-group-item';
        summaryItem.textContent = `นัดหมาย: ${app.patient}`;
        summaryList.appendChild(summaryItem);

        // เพิ่มรายได้
        total += app.revenue;
        totalPayment += app.revenue;
    });

    // อัปเดตรายได้รวมและยอดชำระเงิน
    totalRevenue.textContent = total;
    paymentAmount.textContent = totalPayment;

    // อัปเดตข้อมูลแอดมิน
    updateAdminInfo(doctorId);
}

// ฟังเหตุการณ์การเปลี่ยนแปลงในฟิลเตอร์แพทย์
document.getElementById('doctorFilter').addEventListener('change', updateAppointments);

// ฟังเหตุการณ์การเปลี่ยนแปลงในฟิลเตอร์วันที่
document.getElementById('dateFilter').addEventListener('change', updateAppointments);

// ปุ่มรีเฟรชข้อมูล
document.getElementById('refreshButton').addEventListener('click', function() {
    // รีเซ็ตค่าฟิลเตอร์แพทย์และวันที่
    document.getElementById('doctorFilter').value = '';
    document.getElementById('dateFilter').value = '';

    // ตั้งค่ารายได้รวมและยอดชำระเงินเป็นศูนย์
    document.getElementById('totalRevenue').textContent = '0';
    document.getElementById('paymentAmount').textContent = '0';

    // เรียกใช้งานฟังก์ชันเพื่ออัปเดตการนัดหมายใหม่
    updateAppointments();
});

// ปุ่มชำระเงิน
document.getElementById('paymentButton').addEventListener('click', function() {
    alert('ดำเนินการชำระเงินเรียบร้อย');
    document.getElementById('paymentAmount').textContent = '0';
});

// ปุ่มลบนัดหมาย
document.getElementById('deleteButton').addEventListener('click', function() {
    const appointmentIndex = appointments.findIndex(app => app.id === currentAppointmentId);
    if (appointmentIndex !== -1) {
        appointments.splice(appointmentIndex, 1); // ลบจาก array
        alert('ลบนัดหมายเรียบร้อย');
        updateAppointments(); // อัปเดตการแสดงผล
        // ปิด modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('appointmentModal'));
        modal.hide();
    } else {
        alert('ไม่สามารถลบได้');
    }
});

// เริ่มต้นแสดงนัดหมายทั้งหมด
updateAppointments();

const express = require("express")
const {
  getAppointments,
  getAppointmentById,
  getDoctorAppointments,
   getAppointmentsByDoctor,
  createAppointment,
  cancelAppointment,
  getAvailableTimeSlots,
  updateAppointmentStatus,
  rescheduleAppointment,
  
} = require("../controllers/appointmentController")
const { protect, admin} = require("../middleware/authMiddleware")

const router = express.Router()



/*router.route("/doctors").get(protect,getDoctorAppointments);
router.route("/:doctorId").get(protect,admin, getAppointmentsByDoctor);
router.route("/").get(protect, getAppointments).post(protect, createAppointment);
//router.route("/").post(protect, createAppointment);
router.route("/:id").get(protect, getAppointmentById).delete(protect, cancelAppointment);
router.route("/user").get(protect, getAppointmentById);
router.route("/available/:doctorId/:date").get(protect, getAvailableTimeSlots);
router.route("/status/:id").patch(protect, updateAppointmentStatus);
router.put('/reschedule/:id', protect, rescheduleAppointment);*/



// Get all appointments for a specific doctor (admin access)
router.route("/doctor-appointments/:doctorId").get(protect, admin, getAppointmentsByDoctor);

// Get all appointments for the currently logged-in doctor (doctor access)
router.route("/doctors").get(protect, getDoctorAppointments);

// Check available time slots
router.route("/available/:doctorId/:date").get(protect, getAvailableTimeSlots);

// Update appointment status
router.route("/status/:id").patch(protect, updateAppointmentStatus);

// Reschedule an appointment
router.put("/reschedule/:id", protect, rescheduleAppointment);

// Get all appointments (admin or general listing)
router.route("/").get(protect, getAppointments).post(protect, createAppointment);

// Get or delete a specific appointment by its ID
router.route("/:id").get(protect, getAppointmentById).delete(protect, cancelAppointment);

// Get all appointments for the currently logged-in user (patient)
router.route("/user").get(protect, getAppointmentById);







module.exports = router
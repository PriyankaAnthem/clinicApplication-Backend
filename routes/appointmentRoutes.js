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
router.route("/:id").get(protect, getAppointmentById).delete(protect, cancelAppointment);
router.route("/user").get(protect, getAppointmentById);
router.route("/available/:doctorId/:date").get(protect, getAvailableTimeSlots);
router.route("/status/:id").patch(protect, updateAppointmentStatus);
router.put('/reschedule/:id', protect, rescheduleAppointment);*/



router.route("/doctors").get(protect, getDoctorAppointments);
router.route("/available/:doctorId/:date").get(protect, getAvailableTimeSlots);
router.route("/status/:id").patch(protect, updateAppointmentStatus);
router.put('/reschedule/:id', protect, rescheduleAppointment);
router.route("/:doctorId").get(protect, admin, getAppointmentsByDoctor);
router.route("/").get(protect, getAppointments).post(protect, createAppointment);
router.route("/:id").get(protect, getAppointmentById).delete(protect, cancelAppointment);
router.route("/user").get(protect, getAppointmentById);











module.exports = router
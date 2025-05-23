const mongoose = require("mongoose")

const appointmentSchema = mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Doctor",
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    date: {
      type: Date,
      required: [true, "Please add a date"],
    },
    timeSlot: {
      type: String,
      required: [true, "Please add a time slot"],
    },
     status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected','Rescheduled'],
    default: 'Pending',
  },
    patientName: {
      type: String,
      required: [true, "Please add a patient name"],
    },
    patientEmail: {
      type: String,
      required: [true, "Please add a patient email"],
    },
    patientPhone: {
      type: String,
      required: [true, "Please add a patient phone number"],
    },
     healthConcern: {
      type: String,
      required: [true, "Please add health concern details"],
    },
  },
  {
    timestamps: true,
  },
)

const Appointment = mongoose.model("Appointment", appointmentSchema)

module.exports = Appointment
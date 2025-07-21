import moment from "moment";
import { Doctor } from "../../Entities/DoctorTbl";
import { AppointmentTbl } from "../../Entities/AppointmentTbl";
import { createResponse } from "../../Helpers/createResponse";

export const addapController = async (req: any, res: any) => {
  try {
    const { patientId, departmentId, doctorId, disease, symptoms, payment, status, appointmentType, date, startTime, } = req.body;
    if (!patientId || !doctorId || !date || !startTime) {
      return createResponse(res, 400, "Missing required fields", [], false, true)
    }
    const doctor = await Doctor.findOne({ where: { id: doctorId } });
    if (!doctor) {
      return createResponse(res, 404, "Doctor not found", [], false, true)
    }
    const dayName = new Date(date).toLocaleDateString("en-US", { weekday: "long" });
    if (!doctor.availableDays || !doctor.availableDays.includes(dayName)) {
      return createResponse(res, 400, `Doctor is not available on ${dayName}`, [], false, true)
    }
    const appointmentStart = moment(`${date} ${startTime}`, "YYYY-MM-DD HH:mm");
    const appointmentEnd = moment(appointmentStart).add(1, 'hour');
    const existingAppointments = await AppointmentTbl.find({ where: { doctorId, date, }, });
    const overlappingAppointment = existingAppointments.find((appt) => {
      const apptStart = moment(`${appt.date} ${moment(appt.startTime).format("HH:mm")}`, "YYYY-MM-DD HH:mm");
      const apptEnd = moment(apptStart).add(1, 'hour');
      return appointmentStart.isBefore(apptEnd) && appointmentEnd.isAfter(apptStart);
    });
    if (overlappingAppointment) {
      const apptStart = moment(`${overlappingAppointment.date} ${moment(overlappingAppointment.startTime).format("HH:mm")}`, "YYYY-MM-DD HH:mm");
      const apptEndFormatted = apptStart.add(59, 'minutes').format("hh:mm A");
      return createResponse(res, 409, `Doctor already has an appointment. Try after ${apptEndFormatted}`, [], false, true)
    }
    const newAppointment = new AppointmentTbl();
    newAppointment.patientId = patientId;
    newAppointment.departmentId = departmentId;
    newAppointment.doctorId = doctorId;
    newAppointment.disease = disease;
    newAppointment.symptoms = symptoms;
    newAppointment.payment = payment;
    newAppointment.status = status;
    newAppointment.appointmentType = appointmentType;
    newAppointment.date = date;
    newAppointment.startTime = appointmentStart.toDate(); 
    await newAppointment.save();
    return createResponse(res, 201, "Appointment created successfully", newAppointment, true, false)
  } catch (error) {
    console.error("Error in addapController:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const GetaddapByPatientController = async (req: any, res: any) => {
  try {
    const { patientId } = req.query;
    const result = await AppointmentTbl.find({ where: { patientId: patientId } })
    if (result?.length > 0) {
      return createResponse(res, 200, `data found successfully`, result, true, false)
    } else {
      return createResponse(res, 404, `No data found`, [], false, true)
    }
  } catch (error) {
    console.error("Error in addapController:", error);
    return createResponse(res, 501, `Internal server Error`, [], false, true)
  }
};
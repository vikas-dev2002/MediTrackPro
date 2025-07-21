import express from 'express';
import {
    ForgetPassswordController,
    resetPassswordController,
    userLoginController,
    userRegisterController
} from '../Contollers/CommonController/LoginFunctionController';
import { 
    addDepartmentController,
    getDepartmentController
 } from '../Contollers/AdminController/DepartmentController';
import { verifyToken } from '../middleware/Verifytoken';
import { getDoctorBydepartmentIdController } from '../Contollers/DoctorController/DepartMentController';
import { addapController, GetaddapByPatientController } from '../Contollers/PatientController/BookAppointmentController';

export const route = express.Router();
//common route
route.post("/login", userLoginController)
route.post("/register", userRegisterController);
route.post('/forget-password', ForgetPassswordController);
route.post('/reset-password', resetPassswordController);

//admin route
route.post('/admin-add-department',verifyToken, addDepartmentController);
route.get('/admin-get-department',verifyToken, getDepartmentController);
//doctor route
route.get('/get-doctor-by-departmentId',verifyToken, getDoctorBydepartmentIdController);

//patient route\
route.post('/doctor-appointment-book',verifyToken, addapController);
route.get('/get-appointment-by-patient',verifyToken, GetaddapByPatientController);  
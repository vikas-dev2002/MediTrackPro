import { createResponse } from "../../Helpers/createResponse";
import { returnUserType } from "../../Helpers/returnUserType";
import jsonwebtoken from 'jsonwebtoken';
import path from "path";
import { uploadFileHelper } from "../../Helpers/uploadFileHelper";
import { createRandomString, sendForgetPasswordMail } from "../../Helpers/SendMailForgetpassword";
export const userLoginController = async (req: any, res: any) => {
    try {
        const { email, password, userType } = req.body;
        const tableName: any = await returnUserType(userType)
        const result = await tableName.findOne({ where: { email, password } });
        const jwtToken = await jsonwebtoken.sign({ id: result?.id, email: result?.email }, `${process.env.JWTSECRET}`, { expiresIn: '2h' })
        const finalResult = { ...result, jwtToken, userType }
        if (result) {
            return createResponse(res, 200, "Login success", finalResult, true, false)
        } else {
            return createResponse(res, 404, "Login FIALED!", [], false, true)
        }
    } catch (err: any) {
        return createResponse(res, 500, "Internal Server Error!", err, false, true)
    }
}
export const userRegisterController = async (req: any, res: any) => {
    try {
        const dataToSave = req.body;
        let { profile } = req.files;
        const pathToSaveFile = path.join(__dirname, '../../uploads/');
        const profileName = uploadFileHelper(profile, pathToSaveFile, res);
        const finalData: any = { ...dataToSave, profile: profileName };
        const TblName: any = await returnUserType(dataToSave?.userType);
        const isExist = await TblName.findOne({ where: { email: dataToSave?.email } });
        console.log(dataToSave?.experience, "35445646");

        if (isExist) {
            return createResponse(res, 208, "User Already Exist !", isExist, false, true)
        } else {
            const result = await TblName.save(finalData);
            if (result) {
                return createResponse(res, 201, "User register successfully !", result, true, false)
            } else {
                return createResponse(res, 404, "User register failed !", result, false, true)
            }
        }
    } catch (err) {
        if (err) {
            createResponse(res, 500, "Internal Server Error", err, false, true);
        }
    }
}

export const ForgetPassswordController = async (req: any, res: any) => {
    const { email, userType } = req.body;
    const TblName: any = await returnUserType(userType);
    const isExist = await TblName.findOne({ where: { email } })
    if (isExist) {
        const token = createRandomString();
        await TblName.update({ email: email }, { token, updatedAt: new Date() })
        await sendForgetPasswordMail(email, token)
        return createResponse(res, 200, "Mail send Successfull !", [], true, false);
    } else {
        return createResponse(res, 404, "User Not Found!", [], false, true);
    }
}

export const resetPassswordController = async (req: any, res: any) => {
    const { token, password, userType } = req.body;
    const TblName: any = await returnUserType(userType);
    const isTokenNotExpired = await TblName.findOne({ where: { token } });
    if (isTokenNotExpired) {
        const tokenIssueTime = new Date(isTokenNotExpired?.updatedAt).getTime()
        const cuurentTime = Date.now();
        const expTime = 300000;
        if ((cuurentTime - tokenIssueTime) >= expTime) {
            await TblName.update({ token }, { token: '' })
            return createResponse(res, 404, "Link has been Expired!", [], false, true);
        } else {
            await TblName.update({ token }, { password: password, token: '' })
            return createResponse(res, 200, "Password  has been Updated successfully!", [], false, true);
        } 
    } else {
        return createResponse(res, 404, "Token has been Expired!", [], false, true);
    } 
}
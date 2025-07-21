import nodemailer from 'nodemailer';

export const sendForgetPasswordMail = async (email: any, token: any) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process?.env?.EMAIL_USER,// EMAIL_USER
            pass: process?.env?.EMAIL_PASSWORD  //EMAIL_PASSWORD
        }
    });
    var mailOptions = {
        from: process?.env?.EMAIL_USER,
        to: email,
        subject: 'Forget password',
        html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Reset Password Email</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">

  <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; margin: 40px auto; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    <tr>
      <td style="padding: 20px; text-align: center; background-color: #007bff; color: white;">
        <h2 style="margin: 0;">CodeHelper</h2>
      </td>
    </tr>

    <tr>
      <td style="padding: 30px;">
        <p style="font-size: 16px; color: #333;">
          Hello,
        </p>

        <p style="font-size: 16px; color: #333;">
          You recently requested to reset your password. Click the button below to reset it.
        </p>

        <p style="text-align: center; margin: 30px 0;">
          <a href="${process?.env?.UI_BASE_URL}?token=${token}"
             style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Reset Password
          </a>
        </p>

        <p style="font-size: 14px; color: #555;">
          If you didn't request a password reset, you can ignore this email.
        </p>

        <p style="font-size: 14px; color: #555; margin-top: 30px;">
          Regards,<br/>
          The CodeHelper Team
        </p>
      </td>
    </tr>

    <tr>
      <td style="padding: 15px; text-align: center; background-color: #f0f0f0; color: #888; font-size: 12px;">
        &copy; ${new Date().getFullYear()} CodeHelper. All rights reserved.
      </td>
    </tr>
  </table>

</body>
</html>
`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

export const createRandomString = (length = 25) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
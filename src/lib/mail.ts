import nodemailer from 'nodemailer';

const SMTP_SERVER_USERNAME = process.env.SMTP_SERVER_USERNAME_G;
const SMTP_SERVER_PASSWORD = process.env.SMTP_SERVER_PASSWORD_G;
const appURL = process.env.NEXT_PUBLIC_APP_URL!;

// Create transporter once and reuse (cached connection)
const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 456,
    secure: true,
    auth: {
      user: SMTP_SERVER_USERNAME,
      pass: SMTP_SERVER_PASSWORD,
    },
    // Enable connection pooling
    pool: true,
    maxConnections: 5,
    rateDelta: 1000,
    rateLimit: 3
});

// Pre-compile the absence email HTML template
const compileAbsenceEmailTemplate = (studentName: string, subjectName: string, formattedDate: string, justificationLink: string, teacherName: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Absence Justification</title>
</head>
<body style="font-family:Arial,sans-serif;line-height:1.6;color:#333;margin:0;padding:0;background-color:#f4f4f4">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
        <tr>
            <td style="padding:20px">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;margin:0 auto;background-color:#fff;border-radius:8px;box-shadow:0 4px 6px rgba(0,0,0,0.1)">
                    <tr>
                        <td style="padding:40px">
                            <h1 style="color:#333;font-size:24px;margin-bottom:20px">Absence Notification</h1>
                            <p style="margin-bottom:20px">Dear ${studentName},</p>
                            <p style="margin-bottom:20px">Our records indicate that you were absent from <strong>${subjectName}</strong> on <strong>${formattedDate}</strong>.</p>
                            <p style="margin-bottom:20px">Please provide a justification for this absence by clicking the button below:</p>
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:30px auto">
                                <tr>
                                    <td style="border-radius:4px;background-color:#0070f3;text-align:center">
                                        <a href="${justificationLink}" style="background-color:#0070f3;border:none;color:#fff;padding:12px 24px;text-decoration:none;font-weight:bold;display:inline-block;border-radius:4px">Justify Absence</a>
                                    </td>
                                </tr>
                            </table>
                            <p style="margin-bottom:20px">If you believe this absence has been recorded in error, you can also use the link above to let us know.</p>
                            <p style="margin-top:40px;font-size:14px;color:#666">Best regards,<br>${teacherName}</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td style="padding:20px;text-align:center;font-size:12px;color:#666">
                <p>&copy; 2025, Department of Computer Science. All rights reserved.</p>
            </td>
        </tr>
    </table>
</body>
</html>`;

// Generic email sending function with better error handling and Promise resolution
export const sendEmail = async (mailOptions: {
    from: string,
    to: string,
    subject: string,
    html: string,
}): Promise<boolean> => {
    try {
      await transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
};

export async function SendUpdateEmail(email: string, documents: string, status: string): Promise<boolean> {
    const mailOptions = {
        from: "documents request service <imad55777@gmail.com>",
        to: email,
        subject: 'Request update',
        html: `<p>Your request for ${documents} has been ${status}</p>`,
    };
  
    return await sendEmail(mailOptions);
}  

export async function SendAbsenceEmail({
    email, 
    studentName,
    subjectId, 
    subjectName, 
    teacherName, 
    date
}: { 
    email: string, 
    studentName: string, 
    subjectId: number, 
    subjectName: string, 
    teacherName: string, 
    date: Date 
}): Promise<boolean> {
    try {
        // Create link and format date in one go
        const justificationLink = `${appURL}/dashboard/class/${subjectId}`;
        const formattedDate = new Intl.DateTimeFormat('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);

        // Generate email HTML using pre-compiled template function
        const html = compileAbsenceEmailTemplate(
            studentName, 
            subjectName, 
            formattedDate, 
            justificationLink, 
            teacherName
        );

        const mailOptions = {
            from: "absence request service <imad55777@gmail.com>",
            to: email,
            subject: 'Absence notification',
            html
        };
  
        return await sendEmail(mailOptions);
    } catch (error) {
        console.error('Error preparing absence email:', error);
        return false;
    }
}
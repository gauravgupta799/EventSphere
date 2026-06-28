import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();


const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
})

transporter.verify((error)=>{
    if(error){
        console.log("SMTP Error", error);
    }else{
        console.log("SMTP Connect Successfully!");
    }
});

export const sendOTPEmail = async (email, otp, type)=>{
    try {
        const title = type === "account_verification" ? "Verify your website account" : "Website OTP verify"
        const msg = type === "account_verification" ?
        "Please use the following OTP to verify your account." 
        : "Please use the following OTP to verify and confirm your event booking"

        const info = await transporter.sendMail({
            from: `My website <${process.env.EMAIL_USER}>`,
            to:email,
            subject:"Email Verification OTP",
            text:`Your OTP is ${otp}. It will expire in 10 minutes.`,
            html:`
                <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:30px;border:1px solid #ddd;border-radius:10px;">
                    <h2 style="color:#2563eb;text-align:center;">${title}</h2>
                    <p>Hello,</p>
                    <p>${msg}</p>
                    <div style="text-align:center;margin:25px 0;">
                        <span style="display:inline-block;background:#2563eb;color:#fff;padding:15px 30px;font-size:30px;font-weight:bold;letter-spacing:6px;border-radius:8px;">
                            ${otp}
                        </span>
                    </div>

                    <p>This OTP is valid for <strong>10 minutes</strong>.</p>
                    <p>If you didn't request this OTP, simply ignore this email.</p>
                    <hr>
                    <p style="font-size:12px;color:#888;">
                        This is an automated email. Please don't reply.
                    </p>
                </div>
            `
        });

        console.log(`OTP email sent to ${email} for ${type}`);

        return { success: true,  messageId:info.messageId }
        
    } catch (error) {
        console.log(`Error sending OTP email to ${email} for ${type}: `, error);
        return { success:false,  error: error.message }
    }
}

export const sendBookingEmail = async ( userEmail, username, eventTitle ) => {
    try {
        await transporter.sendMail({
            from: `"EventSphere" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: `🎉 Booking Confirmed - ${eventTitle}`,
            html: `
            <div style=" max-width:600px; margin:auto; font-family:Arial,sans-serif; background:#ffffff; border:1px solid #e5e7eb; border-radius:10px; overflow:hidden; ">
                <div style=" background:#2563eb; color:#ffffff; padding:25px; text-align:center;">
                    <h1 style="margin:0;">Booking Confirmed 🎉</h1>
                </div>
                <div style="padding:30px;">
                    <h2 style="margin-top:0;">Hi ${username},</h2>
                    <p>Great news! Your booking has been confirmed.</p>

                    <div style=" background:#f3f4f6; padding:20px; border-radius:8px; margin:25px 0; ">
                        <h3 style="margin-top:0;">Event Details</h3>
                        <p><strong>Event:</strong>${eventTitle}</p>
                        <p> <strong>Status: </strong><span style="color:green;">Confirmed</span></p>
                    </div>

                    <p>Please keep this email as confirmation of your booking.</p>
                    <p> We look forward to seeing you at the event!</p>

                    <div style="text-align:center;margin:35px 0;">
                        <a href="https://yourwebsite.com/my-bookings"
                           style="background:#2563eb; color:#fff;text-decoration:none; padding:14px 28px; border-radius:6px; display:inline-block;">
                            View My Booking
                        </a>
                    </div>

                    <hr>
                    <p style="font-size:13px; color:#777;">
                        If you have any questions,
                        simply reply to this email or contact our support team.
                    </p>

                </div>
            </div>
            `
        });

        console.log(`Booking email sent to ${userEmail}`);

        return {
            success: true
        };

    } catch (error) {
        console.error(error);
        return {
            success: false,
            error: error.message
        };

    }
};

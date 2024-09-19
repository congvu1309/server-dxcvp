require('dotenv').config();
import nodemailer from 'nodemailer';

let sendSimpleEmail = async (dataSend) => {

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    const info = await transporter.sendMail({
        from: '"dxcvp" <no-reply@dxcvp.com>',
        to: dataSend.reciverEmail,
        subject: "Thông tin đặt lịch",
        text: `Xin chào ${dataSend.name},\n\n${dataSend.content} tại dxcvp.\nThời gian nhận phòng: ${dataSend.checkIn} - ${dataSend.startDate}\nThời gian trả phòng: ${dataSend.checkOut} - ${dataSend.endDate}\nDịch vụ: ${dataSend.title}\nChủ nhà: ${dataSend.hoast}\nĐịa điểm: ${dataSend.provinces} - ${dataSend.districts}\n\nCảm ơn bạn đã đặt lịch tại dxcvp. Chúc bạn có một kỳ nghỉ tuyệt vời!`,
        html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h2 style="color: #007BFF; margin-bottom: 20px;">Xin chào ${dataSend.name},</h2>
            <p style="font-size: 18px;">${dataSend.content}.</p>
            <p style="font-size: 16px; margin-bottom: 20px;">Dưới đây là thông tin chi tiết:</p>
    
            <div style="border: 1px solid #ddd; padding: 15px; border-radius: 8px; background-color: #f9f9f9;">
                <div style="margin-bottom: 15px;">
                    <strong>Thời gian nhận phòng:</strong> 
                    <span style="color: #555;">${dataSend.checkIn} - ${dataSend.startDate}</span>
                </div>
                <div style="margin-bottom: 15px;">
                    <strong>Thời gian trả phòng:</strong> 
                    <span style="color: #555;">${dataSend.checkOut} - ${dataSend.endDate}</span>
                </div>
                <div style="margin-bottom: 15px;">
                    <strong>Dịch vụ:</strong> 
                    <span style="color: #555;">${dataSend.title}</span>
                </div>
                <div style="margin-bottom: 15px;">
                    <strong>Chủ nhà:</strong> 
                    <span style="color: #555;">${dataSend.hoast}</span>
                </div>
                <div style="margin-bottom: 15px;">
                    <strong>Địa điểm:</strong> 
                    <span style="color: #555;">${dataSend.provinces} - ${dataSend.districts}</span>
                </div>
            </div>
    
            <p style="font-size: 16px; margin-top: 20px;">Cảm ơn bạn đã đặt lịch tại 
            <strong>
                 <a href=${dataSend.redirectLink} target="_blank">dxcvp</a>
            </strong>.
             Chúc bạn có một kỳ nghỉ tuyệt vời!</p>
        </div>
        `,
    });
}

module.exports = { sendSimpleEmail }
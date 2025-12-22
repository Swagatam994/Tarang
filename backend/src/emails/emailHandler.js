import { resendClient,sender } from "../lib/resend.js"
import { createWelcomeEmailTemplate } from "./emailTemplate.js"

export const senderWelcomeEmail=async(senderWelcomeEmail,name,clientURL)=>{
    const {data,error}=await resendClient.emails.send({
        from:`${sender.name} <${sender.email}>`,
        to:senderWelcomeEmail,
        subject:"Welcome to Tarang!",
        html:createWelcomeEmailTemplate(name,clientURL)
    });

    if(error){
        console.error("Error sending welcome email", error);
        throw new Error("Failed to send welcome emial");
    }

    console.log("Welcome Email send successfully",data);
}
import { EmailTemplate } from "@/components/email-template";
import { config } from "@/data/config";
import { Resend } from "resend";
import { z } from "zod";

//const resend = new Resend(process.env.RESEND_API_KEY);

const Email = z.object({
  fullName: z.string().min(2, "Full name is invalid!"),
  email: z.string().email({ message: "Email is invalid!" }),
  message: z.string().min(10, "Message is too short!"),
});
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log(body);
    const {
      success: zodSuccess,
      data: zodData,
      error: zodError,
    } = Email.safeParse(body);
    if (!zodSuccess)
      return Response.json({ error: zodError?.message }, { status: 400 });
    
        // 注释掉实际的邮件发送代码，只返回成功
    console.log("? 邮件内容:", {
      from: "Portfolio <onboarding@resend.dev>",
      to: config.email,
      subject: "Contact me from portfolio",
      message: zodData
    });

    // 直接返回成功，不实际发送邮件
    return Response.json({ 
      success: true, 
      message: "消息已收到（演示模式）",
      data: {
        fullName: zodData.fullName,
        email: zodData.email,
        message: zodData.message
      }
    }, { status: 200 });
 
    /*const { data: resendData, error: resendError } = await resend.emails.send({
      from: "Porfolio <onboarding@resend.dev>",
      to: [config.email],
      subject: "Contact me from portfolio",
      react: EmailTemplate({
        fullName: zodData.fullName,
        email: zodData.email,
        message: zodData.message,
      }),
    });

    if (resendError) {
      return Response.json({ resendError }, { status: 500 });
    }

    return Response.json(resendData);*/
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}

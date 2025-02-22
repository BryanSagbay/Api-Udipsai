import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/libs/mongodb";
import { messages } from "@/utils/messages";
import User from "@/models/User";
import { Resend } from "resend";
import jwt from "jsonwebtoken";
import { EmailTemplate } from "@/app/components";

const resend = new Resend("re_cjoG7Y1E_EsF32pPsAAqrdQRH2q2nj1pX");

export async function POST(request: NextRequest) {
  try {
    const body: { email: string } = await request.json();

    const { email } = body;

    await connectMongoDB();
    const userFind = await User.findOne({ email });

    // Validar que exista el usuario
    if (!userFind) {
      return NextResponse.json(
        { message: messages.error.userNotFound },
        { status: 400 }
      );
    }

    const tokenData = {
      email: userFind.email,
      userId: userFind._id,
    };

    if (!process.env.JWT_SECRET) {
      return NextResponse.json(
          { message: "JWT_SECRET no está definido en las variables de entorno" },
          { status: 500 }
      );
    }

    const token = jwt.sign({ data: tokenData }, process.env.JWT_SECRET, {
      expiresIn: 86400,
    });

    const forgetUrl = `${process.env.BASE_URL}/change-password?token=${token}`;

    // @ts-ignore
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Cambio de Contraseña",
      react: EmailTemplate({ buttonUrl: forgetUrl }),
    });

    return NextResponse.json(
      { message: messages.success.emailSent },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: messages.error.default, error },
      { status: 500 }
    );
  }
}

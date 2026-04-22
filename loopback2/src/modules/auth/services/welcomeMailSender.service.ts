import { injectable } from '@loopback/core';
import * as nodemailer from "nodemailer";
import * as dotenv from 'dotenv'
dotenv.config()
@injectable()
export class MailService {
  constructor() { }

  private transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST ?? "localhost",
    port: Number(process.env.MAIL_PORT) ?? 1025,
    secure: (process.env.MAIL_SECURE === "true"),
    auth: {
      user: process.env.MAIL_USER ?? "user",
      pass: process.env.MAIL_PASS ?? "1234",
    }
  });


  mailConfig = {
    from: '"Alejandro Garcia" hola@ejemplo.com',
    subject: "Bienvenida a la aplicacion",
    text: "Gracias por registrarte, DISFRUTA!!"
  }
  async sendWelcomeMail() {
    try {
      const info = await this.transporter.sendMail(this.mailConfig)
      console.log("Mensaje en viandose", info.messageId);
    } catch (error) {
      console.error(error)
    }
  }

  async sendSignUpMail(mail: string) {
    try {
      const info = await this.transporter.sendMail(
        {to: mail,
        ...this.mailConfig
      })
      console.log("Mensaje en viandose", info.messageId);
    } catch (error) {
      console.error(error)
    }
  }

}


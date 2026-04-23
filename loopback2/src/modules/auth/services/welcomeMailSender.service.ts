import { inject, injectable } from '@loopback/core';
import * as nodemailer from "nodemailer";
import * as dotenv from 'dotenv'
import { repository } from '@loopback/repository';
import { User, UserRepository } from '@loopback/authentication-jwt';


dotenv.config()
@injectable()
export class MailService {
  constructor(@repository(UserRepository)
  private readonly userRepository: UserRepository) { }

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
        {
          to: mail,
          ...this.mailConfig
        })
      console.log("Mensaje en viandose", info.messageId);
    } catch (error) {
      console.error(error)
    }
  }

  async sendVerifyEmail(mail: string, token: string) {


    try {
      const info = await this.transporter.sendMail(
        {
          to: mail,
          from: '"Alejandro Garcia" hola@ejemplo.com',
          subject: "Verifica tu cuenta en [APPNAME]",
          text: `Pincha en este enlace para verificarte \nEnlace: http://localhost:9000/#/auth/verify-mail?token=${token}`,
        })
      console.log("Mensaje en viandose", info.messageId);
    } catch (error) {
      console.error(error)
    }
  }

  async findUserMail(userId: string) {
    try {
      const user = await this.userRepository.findById(userId)
      return user.email
    }
    catch (error) {
      console.error(error)
    }
  }

}


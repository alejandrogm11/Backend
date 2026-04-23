import { ofetch } from "ofetch";
import { useQuasar } from "quasar";

const $q = useQuasar()

export function callsendVerificationMail (){
  void sendVerificationMail();
}

export async function sendVerificationMail() {
  try {
    const data = await ofetch('/api/auth/verify-mail')
    if (data) {
      $q.notify({
        message: "Correo de verificacion enviado al correo",
        color: "positive",
        position: "top",
      })
    }
  } catch (error) {
    console.error(error)
  }
}


import { ofetch } from "ofetch";
import { useQuasar } from "quasar";


const $q = useQuasar();

export async function checkUserMail(): Promise<boolean> {
  try {
    const isVerified = await ofetch('/api/auth/check-verify-mail')
    console.log("Verificando Mail")
    if (isVerified) {
      return true
    }

  } catch (error) {
    $q.notify({
      message: 'Error en la red, no se puedo conectar con la api '
    })
    console.error(error)
  }
  console.log("Check user mail = False")
  return false
}


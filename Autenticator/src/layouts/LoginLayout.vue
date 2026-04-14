<template>

  <div class="contenedor">
    <q-card class="my-card" bordered>
      <q-card-section class="items-center text-center">
        <div class="text-h6">Login para todos</div>
      </q-card-section>

      <q-separator dark inset/>

      <q-card-section class="text-center">
        <div class="text-h7">Bienvenido</div>
        <br>
        <q-input standout v-model="email" type="email" label="Email" item-aligned>
          <template v-slot:prepend>
            <q-icon name="mail" />
          </template>

        </q-input>
        <q-input
          v-model="passwd"
          standout
          :type="isPwd ? 'password' : 'text'"
          label="Password"
          item-aligned
        >
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
          <template v-slot:prepend>
            <q-icon name="key" />
          </template>
        </q-input>

        <br>

        <q-checkbox text="dark" color="positive" left-label v-model="rememberMe" label="Mantener sesión" class="remember"/>

        <br>
        <q-btn push color="info" icon="login" label="Login" @click="handleLogin"/>


      </q-card-section>

      <q-separator spaced inset vertical dark />
    </q-card>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import { useQuasar } from 'quasar'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from 'src/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const $q = useQuasar()

//Visibilidad de contraseña
const isPwd = ref(false)

const email = ref()
const passwd = ref()
const rememberMe = ref(false)


// FUncion para mostrar spinner
// function delay(ms: number = 2000): Promise<void> {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

// DEBUG
async function handleLogin(){
  console.log(email.value, passwd.value, rememberMe.value)

  if (!$q) {
    console.error('Quasar no está disponible')
    return
  }

  $q.loading.show({
    delay: 200,
    message: "Intentando iniciar sesion",
    spinnerColor: "secondary"
  })

    // Aquí usarás await con tu petición a la API

  try{
    await authStore.login(email.value, passwd.value, rememberMe.value)
    const redirect = (route.query.redirect as string ) || '/'
    await router.push(redirect)
  }
  catch{
    $q.notify({type: 'negative', message: 'Credenciales invalidas'})
  }
  finally{
    $q.loading.hide()
  }
}


// Fin del Script
</script>


<style scoped lang="scss">

.remember{
  margin-left: 20px;
  display: flex;
  align-items: left;
  justify-content: left;
  color: $dark;
}

.my-card {
  max-width: 700;
  width: 570px;
}
.my-card {
  background: rgba(206, 205, 205, 0.5);
  backdrop-filter: blur(12px);
  border-radius: 16px;
  padding: 24px;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.1);
}



.contenedor {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
}
/* fondo */

.contenedor {
  background: linear-gradient(
    120deg,
    #205164,
    #234855,
    #6ab2d1
  );
  background-size: 200% 200%;
  animation: gradientMove 10s ease-in-out infinite;
  min-height: 100vh;
}

/* Animación muy suave */
@keyframes gradientMove {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>

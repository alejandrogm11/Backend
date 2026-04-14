<template>
  <div class="contenedor">

    <q-form class="my-card" bordered @submit.prevent="handleLogin">

      <q-card-section class="items-center text-center">
        <div class="text-h6">Login para todos</div>
      </q-card-section>

      <q-separator dark inset />

      <q-card-section class="text-center">
        <div @keyup.enter="handleLogin">
          <div class="text-h7">Bienvenido</div>
          <br />
          <q-input
            standout
            v-model="email"
            type="email"
            label="Email"
            item-aligned
            class="mail"
            :rules="emailRules"
          >
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
            :rules="passwordRules"
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

          <br />

          <q-checkbox
            text="dark"
            color="positive"
            left-label
            v-model="rememberMe"
            label="Mantener sesión"
            class="remember"
          />

          <br />
          <q-btn push color="info" icon="login" label="Login" @click="handleLogin" />
        </div>
      </q-card-section>

      <q-separator spaced inset vertical dark />
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from 'src/stores/auth';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const $q = useQuasar();

//Visibilidad de contraseña
const isPwd = ref(false);
const email = ref();
const passwd = ref();
const rememberMe = ref(false);

// Validacion de campos
const emailRules = [
  (val: string) => !!val || 'El email es obligatorio',
  (val: string) => /.+@.+\..+/.test(val) || 'Email inválido',
];

const passwordRules = [
  (val: string) => !!val || 'La contraseña es obligatoria',
  (val: string) => val.length >= 8 || 'Mínimo 8 caracteres',
];


async function handleLogin() {
  // DBUG: console.log(email.value, passwd.value, rememberMe.value);

  //TODO: Hacer funcion qe valide y llame a handlelogin

  if (!$q) {
    console.error('Quasar no está disponible');
    return;
  }

  $q.loading.show({
    delay: 200,
    message: 'Intentando iniciar sesion',
    spinnerColor: 'secondary',
  });

  // Aquí usarás await con tu petición a la API

  try {
    await authStore.login(email.value, passwd.value, rememberMe.value);
    const redirect = (route.query.redirect as string) || '/';
    await router.push(redirect);
  } catch {
    $q.notify({ type: 'negative', message: 'Credenciales invalidas' });
  } finally {
    $q.loading.hide();
  }
}

// Fin del Script
</script>
<!--
<style scoped lang="scss">
.mail {
  padding-bottom: 20px;
}

.remember {
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
  background: linear-gradient(120deg, #205164, #234855, #6ab2d1);
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
</style> -->
<style soceped lang="scss">
.mail {
  margin-bottom: 18px;
}

.remember {
  margin-top: 10px;
  display: flex;
  justify-content: flex-start;
  color: rgba(255, 255, 255, 0.8);
}

/* CARD */
.my-card {
  width: 100%;
  max-width: 550px;

  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(18px);

  border-radius: 20px;
  padding: 32px 28px;

  color: white;

  border: 1px solid rgba(255, 255, 255, 0.15);

  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.25);

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.my-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 50px rgba(0, 0, 0, 0.35);
}

/* CONTENEDOR */
.contenedor {
  display: flex;
  align-items: center;
  justify-content: center;

  min-height: 100vh;
  padding: 20px;

  background: linear-gradient(120deg, #1f3c47, #234855, #6ab2d1);
  background-size: 200% 200%;
  animation: gradientMove 12s ease-in-out infinite;
}

/* TITULOS */
.text-h6 {
  font-weight: 600;
  letter-spacing: 1px;
}

.text-h7 {
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: 10px;
}

/* INPUTS */
.q-input {
  margin-bottom: 12px;
}

.q-field--standout .q-field__control {
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.08);
}

/* BOTON */
.q-btn {
  width: 100%;
  margin-top: 10px;
  border-radius: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.q-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
}

/* ANIMACION FONDO */
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

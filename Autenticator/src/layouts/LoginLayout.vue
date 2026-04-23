<template>
  <div class="contenedor">
    <q-btn color="primary" icon="home" label="Home" @click="goHome" class="home-btn"> </q-btn>
    <q-form class="my-card" bordered @submit.prevent="validateForm">
      <q-card-section class="items-center text-center">
        <div class="text-h6">Login - AGM</div>
      </q-card-section>

      <q-separator dark inset />

      <q-card-section class="text-center">
        <div @keyup.enter="validateForm">
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
            class="password"
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
          <div class="remember-signup-container">
            <q-checkbox
              text="dark"
              color="positive"
              left-label
              v-model="rememberMe"
              label="Mantener sesión Iniciada"
              class="remember"
            />

            <router-link to="/signup" class="signup-link"
              >¿No tienes cuenta? Regístrate</router-link
            >
          </div>

          <br />
          <q-btn class="btn" push color="info" icon="login" label="Login" @click="validateForm" />
        </div>
      </q-card-section>

      <q-separator spaced inset vertical dark />
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { useAuthStore } from 'src/stores/auth';
import { checkUserMail } from 'src/services/checkUserMailVerified.service';
import { callsendVerificationMail } from 'src/services/sendVerificationEmail.service';
import { Dialog } from 'quasar';

const router = useRouter();
// const route = useRoute();
const authStore = useAuthStore();
const $q = useQuasar();

//Visibilidad de contraseña
const isPwd = ref(true);
const email = ref('');
const passwd = ref('');
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

// Valida la entrada en el form
async function validateForm() {
  if (email.value === '' && passwd.value === '') {
    $q.notify({
      type: 'warning',
      message: 'Los campos email/contraseña no pueden estar vacios',
      position: 'top',
    });
    return;
  }
  if (!email.value.includes('@') && !(passwd.value.length >= 8)) {
    $q.notify({ type: 'negative', message: 'Introduce email/contraseña válidos', position: 'top' });
    return;
  }
  await handleLogin();
}

async function goHome() {
  await router.push('/');
}

function verifyDialog() {
  Dialog.create({
    title: '📧 Verifica tu correo',
    message: 'Para poder seguir usando la aplicación, necesitas verificar tu email.',

    persistent: true,
    html: true,

    class: 'verify-dialog',

    ok: {
      label: 'Verificar ahora',
      color: 'primary',
      unelevated: true,
      rounded: true,
    },

    cancel: {
      label: 'Más tarde',
      color: 'warning',
      flat: true,
      rounded: true,
    },
  })
    .onOk(() => callsendVerificationMail())
    .onCancel(() =>
      $q.notify({
        message: 'Verificación cancelada',
        position: 'top',
        color: 'negative',
        icon: 'cancel',
      }),
    );
}

async function handleLogin() {
  // DBUG: console.log(email.value, passwd.value, rememberMe.value);

  if (!$q) {
    console.error('Quasar no está disponible');
    return;
  }

  $q.loading.show({
    delay: 100,
    message: 'Intentando iniciar sesion',
    spinnerColor: 'secondary',
  });

  // Aquí usarás await con tu petición a la API

  try {
    await authStore.login(email.value, passwd.value, rememberMe.value);
    await router.push('/home');
    $q.loading.hide();
    const isVerified = await checkUserMail();
    console.log(isVerified);
    if (isVerified === false) {
      verifyDialog();
    }
  } catch (error) {
    console.error(error);
    $q.notify({ type: 'negative', message: 'Credenciales invalidas' });
    $q.loading.hide();
  } // finally {
  //   $q.loading.hide();
  // }
}

// Fin del Script
</script>

<style soceped lang="scss">
.mail {
  margin-bottom: 18px;
}

.remember {
  margin-right: 20px;
  display: flex;
  justify-content: flex-start; /*  izquierda */
}

.remember-signup-container {
  display: flex;
  justify-content: space-between; /* espacio entre checkbox y link */
  align-items: center; /* alinear verticalmente */
  margin-top: 10px;
}

.home-btn {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1000;
  border-radius: 12px;
  font-weight: 600;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.signup-link {
  color: $info;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
  cursor: pointer;
  white-space: nowrap;
  margin-left: 20px;
}

.signup-link:hover {
  color: #8bd5ff;
  text-decoration: underline;
}

/* CARD */
.my-card {
  width: 100%;
  max-width: 570px;

  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(18px);

  border-radius: 20px;
  padding: 32px 28px;

  color: white;

  border: 1px solid rgba(255, 255, 255, 0.15);

  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.25);

  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
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

  background: linear-gradient(120deg, #115570, #2c4f5c, #1887b6);
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
.mail .passwd {
  margin-bottom: 12px;
}

.q-field--standout .q-field__control {
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.08);
}

/* BOTON */
.btn {
  width: 100%;
  margin-top: 10px;
  border-radius: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.btn:hover {
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

.verify-dialog .q-card {
  border-radius: 16px;
  background: #0f172a; /* $dark-page */
  color: white;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
}

/* Título */
.verify-dialog .q-dialog__title {
  font-size: 20px;
  font-weight: 600;
  color: #3b82f6; /* $primary */
}

/* Mensaje */
.verify-dialog .q-dialog__message {
  font-size: 14px;
  color: #cbd5e1; /* gris suave tipo Tailwind */
  margin-top: 8px;
  line-height: 1.5;
}

/* Botón OK */
.verify-dialog .q-btn--standard.bg-primary {
  background: #3b82f6 !important; /* primary */
  color: white !important;
}

.verify-dialog .q-btn--standard.bg-primary:hover {
  background: #1e40af !important; /* secondary */
}

/* Botón cancelar */
.verify-dialog .q-btn--flat.text-warning {
  color: #d97706 !important; /* warning */
}

.verify-dialog .q-btn--flat.text-warning:hover {
  background: rgba(217, 119, 6, 0.1);
}
</style>

<template>
  <div class="contenedor">
    <q-form class="my-card" bordered @submit.prevent="validateForm">
      <q-card-section class="items-center text-center">
        <div class="text-h6">Signup - AGM</div>
      </q-card-section>

      <q-separator dark inset />

      <q-card-section class="text-center">
        <div @keyup.enter="validateForm">
          <div class="text-h7">Bienvenido</div>
          <br />

          <q-input
            standout
            v-model="username"
            type="text"
            label="Username"
            item-aligned
            class="username"
          >
            <template v-slot:prepend>
              <q-icon name="person" />
            </template>
          </q-input>

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
            :type="isPwd ? 'text' : 'password'"
            label="Password"
            item-aligned
            :rules="passwordRules"
            class="passwod"
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
            <router-link to="/auth/login" class="login-link"
              >¿Ya tienes cuenta? Inicia sesión</router-link
            >
          </div>

          <br />
          <q-btn class="btn" push color="info" icon="login" label="Sign Up" @click="validateForm" />
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
import { RouterLink } from 'vue-router';
import { SignUp } from 'src/services/signup';
import type { FetchError } from 'ofetch';

const router = useRouter();
const $q = useQuasar();

//Visibilidad de contraseña
const isPwd = ref(true);
const email = ref('');
const passwd = ref('');
const username = ref('');

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
  if (email.value === '' || passwd.value === '') {
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
  if (username.value === '') {
    $q.notify({
      type: 'warning',
      message: 'El campo username no puede estar vacio',
      position: 'top',
    });
    return;
  }

  await handleSignUp();
}

async function handleSignUp() {
  // DBUG: console.log(username.value, email.value, passwd.value);

  if (!$q) {
    console.error('Quasar no está disponible');
    return;
  }

  $q.loading.show({
    delay: 100,
    message: 'Intentando registrar usuario',
    spinnerColor: 'secondary',
  });

  // Aquí usarás await con tu petición a la API

  try {
    await SignUp(username.value, email.value, passwd.value);
    await router.push('/auth/login');
    $q.notify({ type: 'positive', message: 'Usuario registrado con éxito', position: 'top' });
  } catch (error: unknown) {
    const err = error as FetchError;
    let errorMessage = 'Error al registrar usuario';

    if (err.statusCode === 422) {
      errorMessage = 'Datos inválidos: ' + (err.data?.message || 'Revisa los campos');
      // DEBUG:console.error('Error al registrar usuario:', err.data);
    } else if (err.statusCode === 409) {
      errorMessage = 'El nombre de usuario ya existe';
      // DEBUG:console.error('Error al registrar usuario:', err.message);
    }
    $q.notify({ type: 'negative', message: errorMessage });
  } finally {
    $q.loading.hide();
  }
}

// Fin del Script
</script>

<style soceped lang="scss">
.mail {
  margin-bottom: 18px;
}

.username {
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

.login-link {
  color: $info;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
  cursor: pointer;
  white-space: nowrap;
  margin-left: 20px;
}

.login-link:hover {
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

  background: linear-gradient(120deg, #115570, #2c4f5c, #6ab2d1);
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
</style>

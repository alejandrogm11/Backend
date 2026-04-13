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
        <q-input standout v-model="email" type="password" label="Password" item-aligned>
          <template v-slot:prepend>
            <q-icon name="key" />
          </template>
        </q-input>
        <br>
        <q-btn push color="primary" icon="login" label="Login" />
      </q-card-section>

      <q-separator spaced inset vertical dark />
    </q-card>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'

const email = ref()

</script>
<style scoped>

.my-card {
  max-width: 700;
  width: 570px;
}
.my-card {
  background: rgba(170, 169, 169, 0.425);
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
    #132c36,
    #234855,
    #406f83
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

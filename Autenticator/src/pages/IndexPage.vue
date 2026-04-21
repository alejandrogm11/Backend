<template>
  <q-page class="row col-12 items-center justify-evenly">
    <q-btn color="primary" icon="login" label="Login" to="/auth/login" />
    <q-btn color="info" icon="home" label="Home" to="/home" />
    <q-btn color="warning" icon="check" label="Logout" @click="showDialog" />

    <q-dialog v-model="isVisible" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-teal text-white" style="width: 400px">
        <q-card-section>
          <q-avatar color="red" text-color="white" icon="directions" />
          <div class="text-h6">Are you sure you want to logout?</div>
        </q-card-section>

        <q-card-section class="q-pt-none"> Click on Logout to close this dialog. </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Logout" v-close-popup @click="logout" style="color: red" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-btn
      v-show="isVisibleButton"
      color="positive"
      icon="terminal"
      label="AdminPanel"
      to="/dashboard/admin"
    />
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { ofetch } from 'ofetch';
import { useRouter } from 'vue-router';
import { QSpinnerTail, useQuasar } from 'quasar';

const router = useRouter();
const $q = useQuasar();

const isVisible = ref(false);
const isVisibleButton = ref(false);

onMounted(async () => {
  const data = await ofetch('/api/verify-owner', {
    method: 'GET',
    credentials: 'include',
  });
  if (data) {
    isVisibleButton.value = data;
  }
});

function showDialog() {
  isVisible.value = !isVisible.value;
}

async function logout() {
  try {
    $q.loading.show({
      message: 'Logging out...',
      spinner: QSpinnerTail,
    });
    await ofetch('/api/auth/logout', {
      method: 'POST',
    });
    await router.push('/auth/login');
  } catch (error) {
    console.error('Logout failed:', error);
    $q.notify({ type: 'negative', message: 'Logout failed. Please try again.' });
  } finally {
    $q.loading.hide();
  }
}
</script>

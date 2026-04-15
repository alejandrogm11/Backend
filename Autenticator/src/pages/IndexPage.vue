<template>
  <q-page class="row col-12 items-center justify-evenly">
    <example-component class="col-8 bg-red"
      title="Example component"
      active
      :todos="todos"
      :meta="meta"
    ></example-component>

    <q-btn color="primary" icon="check" label="Login" to="/auth/login" />
    <q-btn color="primary" icon="check" label="Home" to="/home" />
    <q-btn color="warning" icon="check" label="Logout" @click="showDialog" />

     <q-dialog
      v-model="isVisible"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card class="bg-teal text-white" style="width: 400px">
        <q-card-section>
          <div class="text-h6">Are you sure you want to logout?</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Click on Logout to close this dialog.
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Logout" v-close-popup @click="logout" style="color: red"/>

        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>


</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Todo, Meta } from 'components/models';
import ExampleComponent from 'components/ExampleComponent.vue';
import { ofetch } from 'ofetch';
import { useRouter } from 'vue-router';
import { QSpinnerTail, useQuasar } from 'quasar';

const router = useRouter();
const $q = useQuasar();

const isVisible = ref(false);

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
}
finally{
  $q.loading.hide();
}


}

const todos = ref<Todo[]>([
  {
    id: 1,
    content: 'ct1',
  },
  {
    id: 2,
    content: 'ct2',
  },
  {
    id: 3,
    content: 'ct3',
  },
  {
    id: 4,
    content: 'ct4',
  },
  {
    id: 5,
    content: 'ct5',
  },
]);

const meta = ref<Meta>({
  totalCount: 1200,
});
</script>

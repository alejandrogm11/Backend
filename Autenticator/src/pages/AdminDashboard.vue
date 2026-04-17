<template>
  <q-page class="q-pa-md">
    <div class="row q-gutter-md">
      <div class="col-12 col-md-6 col-lg-3">
        <q-card>
          <div class="text-h5 text-weight-bold">Role Manager</div>
          <q-separator spaced inset vertical dark />
          <div class="searchBar">
            <q-select
              user-input
              v-model="selectedUser"
              :options="users"
              label="Busqueda de Usuario"
              filled
              clearable
            />
          </div>
        </q-card>
      </div>

      <div class="col-12 col-md-6 col-lg-3">
        <q-card>Stats</q-card>
      </div>

      <div class="col-12 col-md-6 col-lg-3">
        <q-card>Stats</q-card>
      </div>

      <div class="col-12 col-md-6 col-lg-3">
        <q-card>Stats</q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ofetch } from 'ofetch';
import { useQuasar } from 'quasar';
import { getAllUsers } from 'src/services/getAllUsers.service';
import { onMounted, ref } from 'vue';

const $q = useQuasar();
const users = ref([]);
const selectedUser = ref();

onMounted(async () => {
  users.value = await getAllUsers();
});
</script>
<style scoped lang="scss">
.searchBar {
  padding: 10px;
}
</style>

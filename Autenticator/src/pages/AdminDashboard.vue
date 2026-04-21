<template>
  <q-page class="q-pa-md">
    <div class="row q-gutter-md">
      <div class="col-12 col-md-6 col-lg-3">
        <q-card>
          <div class="text-h5 text-weight-bold">Role Manager</div>
          <q-separator spaced inset vertical dark />
          <div class="searchBar">
            <q-select
              use-input
              v-model="selectedUser"
              :options="users"
              option-value="value"
              option-label="label"
              label="Busqueda de Usuario"
              filled
              clearable
            />

            <q-separator spaced inset vertical dark />

            <div class="searchBar">
              <div class="text-h5" style="justify-self: center">Roles</div>
              <q-input v-model="cUserRoles" filled readonly> </q-input>

              <div class="text-h5" style="justify-self: center">Añadir Roles</div>
            </div>
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
import { computed } from 'vue';
import { ofetch } from 'ofetch';
import { useQuasar } from 'quasar';
import type { Rol, UserParsed } from 'src/services/getAllUsers.service';
import { getAllUsers } from 'src/services/getAllUsers.service';
import { onMounted, ref, watch } from 'vue';

const $q = useQuasar();
const users = ref([]);
const selectedUser = ref<UserParsed>();
const cUserIdUrl = computed(() => selectedUser.value?.value ?? '');
const userRoles = ref<string[]>([]);
const cUserRoles = computed(() => userRoles.value.join(', '));
onMounted(async () => {
  users.value = await getAllUsers();
});

watch(cUserIdUrl, async (userId) => {
  if (!userId) {
    userRoles.value = [];
    return;
  }

  try {
    const data = await getUserRoles(userId);
    userRoles.value = data.map((role) => role.name);
  } catch (e) {
    console.error(e);
  }
});

async function getUserRoles(userId: string): Promise<Rol[]> {
  return await ofetch<Rol[]>(`/api/users/obtainRoles/${userId}`);
}





</script>
<style scoped lang="scss">
.searchBar {
  padding: 10px;
}
</style>

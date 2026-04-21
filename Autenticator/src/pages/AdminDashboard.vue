<template>
  <q-page class="q-pa-md">
    <div class="row q-gutter-md">
      <div class="col-12 col-md-6 col-lg-3">
        <q-card>
          <div class="text-h5 text-weight-bold">Role Manager</div>
          <q-separator spaced inset vertical dark />
          <div class="searchBar">
            <q-select
              dark
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
              <q-input v-model="cUserRoles" filled readonly dark> </q-input>

              <div class="text-h5" style="justify-self: center">Añadir Roles</div>

              <!-- <q-input v-model="cAvailableRoles" filled readonly></q-input> -->
              <q-select
                v-model="selectedRole"
                :options="cAvailableRoles"
                label="Rol a Añadir"
                filled
                dark
              />

              <q-btn color="accent" icon="add" label="Añadir ROL" @click="asignRole" />
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
import type { Rol, UserParsed } from 'src/services/getAllUsers.service';
import { getAllUsers } from 'src/services/getAllUsers.service';
import { onMounted, ref, watch, unref } from 'vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const users = ref([]);
const selectedRole = ref('');
const selectedUser = ref<UserParsed>();
const cUserIdUrl = computed(() => selectedUser.value?.value ?? '');
const userRoles = ref<string[]>([]);
const cUserRoles = computed(() => userRoles.value.join(', '));
const AvailableRoles = ref<string[]>([]);
const cAvailableRoles = computed(() => unref(AvailableRoles) ?? []);
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

watch(cUserIdUrl, async (userId) => {
  if (!userId) return;

  try {
    const data = await getAvailableUserRoles(userId);
    AvailableRoles.value = data.map((role) => role.name) || [];
  } catch (e) {
    console.error(e);
  }
});

async function getUserRoles(userId: string): Promise<Rol[]> {
  return await ofetch<Rol[]>(`/api/users/obtainRoles/${userId}`, {
    credentials: 'include',
  });
}
async function getAvailableUserRoles(userId: string): Promise<Rol[]> {
  return await ofetch<Rol[]>(`/api/admin/available-roles/${userId}`, {
    credentials: 'include',
  });
}

async function asignRole() {
  const UuserId = unref(cUserIdUrl);
  const UroleName = unref(selectedRole);
  try {
    $q.loading.show();
    const data = await ofetch('/api/user-roles', {
      method: 'POST',
      credentials: 'include',
      body: {
        idUsuario: UuserId,
        roleName: UroleName,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });
    selectedUser.value = { id: '', label: '', value: '' };
    selectedRole.value = '';
    $q.notify({ message: 'Rol Añadido', position: 'top', color: 'positive' , siz});
    return data;
  } catch (error) {
    console.error(error);
    $q.notify({ message: 'Error Añadiendo Rol', position: 'top', color: 'negative' });
  } finally {
    $q.loading.hide();
  }
}
</script>
<style scoped lang="scss">
.searchBar {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.q-card {
  background: $dark;
  color: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.text-h5 {
  color: $primary;
  margin-bottom: 8px;
}

.q-separator {
  background: $secondary;
  opacity: 0.6;
}

.q-select,
.q-input {
  width: 100%;
}

.q-btn {
  align-self: flex-start;
  background: $accent;
  color: white;
  font-weight: bold;
  transition: 0.2s ease;
}

/* Tarjetas de stats */
.q-card:has(> .text-h5),
.q-card {
  min-height: 120px;
}

/* Layout spacing */
.q-page {
  background: $dark-page;
  min-height: 100vh;
}
</style>

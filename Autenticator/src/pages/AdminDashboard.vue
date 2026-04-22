<template>
  <q-page class="q-pa-md">
    <div class="row q-gutter-md">
      <div class="col-12 col-md-6 col-lg-3">
        <q-card>
          <div class="text-h4 text-weight-bold">Role Manager</div>

          <div class="textoinfo" style="justify-self: center">
            Selecciona el usuario para depues añadir o quietar el rol
          </div>

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

            <q-dialog v-model="showAddRole" persistent>
              <q-card>
                <q-card-section class="row items-center">
                  <q-avatar icon="person_add" color="primary" text-color="white" />
                  <span class="q-ml-sm">Añadir Rol a {{ selectedUser?.label }}</span>
                </q-card-section>
                <q-card-section>
                  <q-input v-model="cUserRoles" filled readonly dark />
                  <q-select
                    v-model="selectedRole"
                    :options="cAvailableRoles"
                    label="Rol a Añadir"
                    filled
                    dark
                  />
                </q-card-section>
                <q-card-actions align="right">
                  <q-btn flat label="Cancelar" color="warning" v-close-popup />
                  <q-btn
                    flat
                    label="Añadir Rol"
                    color="secondary
                    "
                    v-close-popup
                    @click="asignRole"
                  />
                </q-card-actions>
              </q-card>
            </q-dialog>

            <!-- Boton Eliminar -->
            <q-dialog v-model="showDeleteRole" persistent>
              <q-card>
                <q-card-section class="row items-center">
                  <q-avatar icon="person_off" color="primary" text-color="white" />
                  <span class="q-ml-sm">Eliminar Rol a {{ selectedUser?.label }}</span>
                </q-card-section>
                <q-card-section>
                  <div class="text-h5" style="justify-self: center">Roles Activos</div>
                  <q-input v-model="cUserRoles" filled readonly dark> </q-input>
                  <q-select
                    v-model="selectedDelRole"
                    :options="delUserRoles"
                    label="Selecciona un Rol a Eliminar"
                    filled
                    dark
                  />
                </q-card-section>
                <q-card-actions align="right">
                  <q-btn flat label="Cancelar" color="info" v-close-popup />
                  <q-btn
                    flat
                    label="Quitar ROL"
                    color="negative"
                    v-close-popup
                    @click="deleteRole"
                  />
                </q-card-actions>
              </q-card>
            </q-dialog>
            <!-- Boton Eliminar -->
            <div class="row q-gutter-md q-mt-md" style="justify-content: center">
              <q-btn color="accent" icon="add" label="Añadir ROL" @click="ShowAddRole" />
              <q-btn color="negative" icon="close" label="Eliminar ROL" @click="ShowDeleteRole" />
            </div>
            <!-- Boton Eliminar -->
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

const showDeleteRole = ref(false);
const showAddRole = ref(false);
const $q = useQuasar();
const users = ref([]);
const selectedRole = ref('');
const selectedDelRole = ref('');
const selectedUser = ref<UserParsed>();
const cUserIdUrl = computed(() => selectedUser.value?.value ?? '');
const userRoles = ref<string[]>([]);
const delUserRoles = computed(() => userRoles.value);
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

function ShowDeleteRole() {
  if (selectedUser.value) {
    showDeleteRole.value = !showDeleteRole.value;
  } else {
    $q.notify({
      message: 'Selecciona un usuario primero',
      color: 'warning',
      position: 'top',
    });
  }
}

function ShowAddRole() {
  if (selectedUser.value) {
    showAddRole.value = !showAddRole.value;
  } else {
    $q.notify({
      message: 'Selecciona un usuario primero',
      color: 'warning',
      position: 'top',
    });
  }
}

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
    $q.notify({ message: 'Rol Añadido', position: 'top', color: 'positive' });
    return data;
  } catch (error) {
    console.error(error);
    $q.notify({ message: 'Error Añadiendo Rol', position: 'top', color: 'negative' });
  } finally {
    $q.loading.hide();
  }
}

async function deleteRole() {
  const delUserID = unref(cUserIdUrl);
  const delRoleName = unref(selectedDelRole);
  try {
    $q.loading.show();
    const data = await ofetch('/api/user-roles/delete', {
      method: 'DELETE',
      credentials: 'include',
      body: {
        idUsuario: delUserID,
        roleName: delRoleName,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });
    selectedUser.value = { id: '', label: '', value: '' };
    selectedDelRole.value = '';
    $q.notify({ message: 'Rol Eliminado', position: 'top', color: 'info' });
    return data;
  } catch (error) {
    console.error(error);
    $q.notify({ message: 'Error Eliminando Rol', position: 'top', color: 'negative' });
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

.text-h4 {
  color: $primary;
  margin-bottom: 8px;
  padding: 8px;
  justify-self: center;
}

.textoinfo {
  color: $warning;
  padding: 5px;
  font-size: 16px;
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
  width: 45%;
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

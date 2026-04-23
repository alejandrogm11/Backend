<template>
  <h1>Verificando MAIL ...</h1>
</template>

<script setup lang="ts">
import { ofetch } from 'ofetch';
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';

const $q = useQuasar();
const route = useRoute();

const token = ref(route.query.token as string);
let isValid = ref(false);
onMounted(async () => {
  isValid.value = await validateToken(token.value);
});
if (isValid) {
  $q.notify({
    message: 'Tu mail ha sido verificado de manera correcta',
  });
}

async function validateToken(token: string): Promise<boolean> {
  let data = false;
  try {
    data = await ofetch(`/api/auth/verify-token?token=${token}`, {
      method: 'GET',
      credentials: 'include',
    });
    return data;
  } catch (error) {
    console.error(error);
  }
  return data;
}
</script>

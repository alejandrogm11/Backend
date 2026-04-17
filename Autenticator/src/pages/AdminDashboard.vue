<template>
  <q-page class="q-pa-md">
    <div class="row q-gutter-md">
      <div class="col-12 col-md-6 col-lg-3">
        <q-card>
          <div class="text-h5 text-weight-bold">Role Manager</div>
          <q-separator spaced inset vertical dark />
          <div class="searchBar">
            <q-input v-model="si" type="search" label="Buacar Usuario" class="">
              <template v-slot:append>
                <q-icon name="troubleshoot" />
              </template>
            </q-input>
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
import { ref } from 'vue';

const si = ref();
</script>
<style scoped lang="scss">
.searchBar {
  padding: 10px;
}
</style>

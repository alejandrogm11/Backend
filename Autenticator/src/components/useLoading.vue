<template>
  <div></div>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar'

const $q = useQuasar()


let timer: ReturnType<typeof setTimeout> | null = null

/**
 * Muestra el loading global
 * @param ms duración en milisegundos (por defecto 2000)
 */
const show = (ms: number = 2000): void => {
  // Evita duplicados
  if (timer !== null) {
    clearTimeout(timer)
  }

  $q.loading.show()

  timer = setTimeout(() => {
    $q.loading.hide()
    timer = null
  }, ms)
}

/**
 * Oculta manualmente el loading
 */
const hide = (): void => {
  if (timer !== null) {
    clearTimeout(timer)
    timer = null
  }

  $q.loading.hide()
}

defineExpose({
  show,
  hide
})
</script>

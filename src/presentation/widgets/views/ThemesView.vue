<template>
  <div class="theme-selector-container text-white p-4 rounded">
    <h5 class="mb-3">🎨 Personaliza el color JearCastApp</h5>
    <div class="d-flex flex-wrap gap-3">
      <!-- Colores predeterminados -->
      <button
        v-for="color in presetColors"
        :key="color"
        class="theme-color"
        :data-color="color"
        :style="{ backgroundColor: color }"
        :class="{ selected: currentColor === color }"
        @click="applyTheme(color)"
      ></button>

      <!-- Color personalizado -->
      <label class="theme-color custom-picker">
        <input type="color" hidden ref="colorPicker" @input="handleCustomColor" />
        <span
          style="display: inline-block; width: 32px; height: 32px; background: linear-gradient(to bottom right, #ccc, #999); border-radius: 8px; cursor: pointer;"
          @click="triggerPicker"
        ></span>
      </label>
    </div>

    <div id="theme-selected-check" class="mt-3 text-success" v-show="showCheck">
      ¡Color actualizado!
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const presetColors = [
  '#102c4a', '#5d0909', '#123c24', '#4a0958', '#c64600', '#1a0101', '#124242', // Originales
  '#2d0a2e', // púrpura oscuro
  '#1b2f0d', // verde musgo profundo
  '#0c1c33', // azul petróleo
  '#3b1f07', // marrón oscuro cálido
  '#470029', // vino oscuro
  '#003c3c', // verde petróleo
  '#2f0e0e', // rojo óxido
  '#1c0d2f', // índigo profundo
  '#3a3a00'  // oliva quemado
]
const currentColor = ref('')
const showCheck = ref(false)
const colorPicker = ref<HTMLInputElement | null>(null)

function applyTheme(color: string) {
  document.body.style.setProperty('--main-bg-color', color)
  localStorage.setItem('user-theme-color', color)
  currentColor.value = color

  showCheck.value = true
  setTimeout(() => {
    showCheck.value = false
  }, 1500)
}

function triggerPicker() {
  colorPicker.value?.click()
}

function handleCustomColor(event: Event) {
  const input = event.target as HTMLInputElement
  if (input?.value) {
    applyTheme(input.value)
  }
}

onMounted(() => {
  const saved = localStorage.getItem('user-theme-color')
  if (saved) {
    applyTheme(saved)
  }
})
</script>

<style scoped>
.theme-color {
  width: 32px;
  height: 32px;
  border: 2px solid white;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s;
}
.theme-color:hover {
  transform: scale(1.1);
}
.theme-color.selected {
  box-shadow: 0 0 0 3px #00ffcc;
}
</style>

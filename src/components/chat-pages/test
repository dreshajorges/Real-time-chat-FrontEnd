<script setup lang="ts">

import Navbar from "../layouts/Navbar.vue";
import {ref, watch} from "vue";

const isDarkMode = ref<boolean>(
    JSON.parse(localStorage.getItem('dark-mode') ?? 'false')
)

watch(isDarkMode, (val) => {
  localStorage.setItem('dark-mode', JSON.stringify(val))
})

function changeDarkMode(): void {
  isDarkMode.value = !isDarkMode.value
}

</script>

<template>
  <Navbar @change-dark-mode="changeDarkMode"/>
  <div class='w-full min-h-screen flex'>

    <div :class="isDarkMode ? 'w-1/4 min-h-screen bg-gray-900' : 'w-1/4 min-h-screen bg-gray-300'">

    </div>

    <div :class="isDarkMode ? 'w-3/4 min-h-screen bg-gray-800' : 'w-3/4 min-h-screen bg-gray-100'">

    </div>

  </div>
</template>

<style scoped>

</style>
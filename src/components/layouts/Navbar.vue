<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import {useAuthStore} from "../../stores/auth.ts";
import {useRouter} from "vue-router";

const emits = defineEmits(['change-dark-mode'])

const isDropdownOpen = ref(false)
const dropdownRef = ref(null)
const authStore = useAuthStore()
const router = useRouter()

function changeDarkMode() {
  emits("change-dark-mode")
}

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value
}

function handleProfile() {
  console.log('Profile clicked')
  isDropdownOpen.value = false
  // Add your profile navigation logic here
}

async function handleLogout() {
  authStore.logOut()
  await router.replace({ name: 'SignupLogin' })
}

function handleClickOutside(event: Event) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isDropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})

const username = localStorage.getItem('name')
</script>

<template>
  <div class="w-full flex justify-between items-center bg-blue-600 h-16 pl-7 pr-7">

    <h1 class="text-white font-black text-2xl">Chattify</h1>

    <div class="flex justify-between items-center">
      <!-- User Dropdown -->
      <div v-if="authStore.isLoggedIn" class="relative" ref="dropdownRef">
        <button
            @click="toggleDropdown"
            class="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-blue-800 rounded-md hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors cursor-pointer"
        >
          <div class="w-6 h-6 bg-white rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
          <span>{{ username }}</span>
          <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-4 h-4 transition-transform"
              :class="{ 'rotate-180': isDropdownOpen }"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7" />
          </svg>
        </button>

        <!-- Dropdown Menu -->
        <div
            v-show="isDropdownOpen"
            class="absolute right-0 z-10 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg"
        >
          <div class="py-1">
            <!-- Profile Option -->
            <button
                @click="handleProfile"
                class="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors text-left"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              Profile
            </button>

            <!-- Divider -->
            <div class="border-t border-gray-100 my-1"></div>

            <!-- Logout Option -->
            <button
                @click="handleLogout"
                class="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>

      <div class="flex justify-between items-center">
        <button @click="changeDarkMode" class="bg-blue-800 rounded-2xl p-1.5 cursor-pointer hover:bg-blue-900 ml-4">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Zm0-80q88 0 158-48.5T740-375q-20 5-40 8t-40 3q-123 0-209.5-86.5T364-660q0-20 3-40t8-40q-78 32-126.5 102T200-480q0 116 82 198t198 82Zm-10-270Z"/></svg>
        </button>
      </div>
    </div>




  </div>
</template>

<style scoped>
</style>
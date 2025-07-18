<template>
  <div class="w-full flex justify-between items-center bg-blue-600 h-16 px-8">
    <!-- Logo / Title -->
    <h1 class="text-white font-black text-2xl">Chattify</h1>

    <div class="flex items-center space-x-4">
      <!-- Dark Mode Toggle -->
      <button
          @click="emit('change-dark-mode')"
          class="bg-blue-800 rounded-full p-2 hover:bg-blue-900 cursor-pointer"
          aria-label="Toggle dark mode"
      >
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="#e3e3e3">
          <path d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Zm0-80q88 0 158-48.5T740-375q-20 5-40 8t-40 3q-123 0-209.5-86.5T364-660q0-20 3-40t8-40q-78 32-126.5 102T200-480q0 116 82 198t198 82Zm-10-270Z"/>
        </svg>
      </button>

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
            class="absolute right-0 z-10 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg"
        >
          <div class="py-1">
            <!-- Friend Requests Toggle -->
            <button
                @click="toggleRequests"
                class="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <span>Friend Requests</span>
              <span v-if="requestCount" class="text-xs bg-red-500 text-white rounded-full px-2">
                {{ requestCount }}
              </span>
            </button>

            <!-- Pending Requests List -->
            <div v-if="showRequests" class="max-h-48 overflow-y-auto">
              <ul class="divide-y divide-gray-200">
                <li
                    v-for="req in requestStore.pendingRequests"
                    :key="req.requestId"
                    class="flex items-center justify-between px-4 py-1"
                >
                  <span>{{ req.name }} {{ req.surname }}</span>
                  <div class="flex space-x-2">
                    <button
                        @click="requestStore.acceptRequest(req.requestId)"
                        class="text-green-600 text-sm hover:underline"
                    >
                      Accept
                    </button>
                    <button
                        @click="requestStore.declineRequest(req.requestId)"
                        class="text-red-600 text-sm hover:underline"
                    >
                      Decline
                    </button>
                  </div>
                </li>
                <li v-if="pendingEmpty" class="px-4 py-2 text-sm text-gray-500">
                  No pending requests
                </li>
              </ul>
            </div>

            <!-- Profile & Logout -->
            <div v-else class="mt-2">
              <div class="border-t border-gray-100 my-1"></div>
              <button
                  @click="handleProfile"
                  class="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors text-left"
              >
                Profile
              </button>
              <div class="border-t border-gray-100 my-1"></div>
              <button
                  @click="handleLogout"
                  class="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { useRequestStore } from '../../stores/request'
import { useRouter } from 'vue-router'

const authStore    = useAuthStore()
const requestStore = useRequestStore()
const router       = useRouter()

// dropdown state
const isDropdownOpen = ref(false)
const showRequests   = ref(false)
const dropdownRef    = ref<HTMLElement|null>(null)

// reactive username
const username = computed(() => localStorage.getItem('name') || '')

// counts
const requestCount = computed(() => requestStore.pendingRequests.length)
const pendingEmpty = computed(() => requestCount.value === 0)

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value
  if (!isDropdownOpen.value) showRequests.value = false
}

function toggleRequests() {
  showRequests.value = !showRequests.value
  if (showRequests.value) {
    requestStore.loadRequests()
  }
}

function handleProfile() {
  isDropdownOpen.value = false
  // e.g. router.push({ name: 'Profile' })
}

async function handleLogout() {
  authStore.logOut()
  await router.replace({ name: 'SignupLogin' })
}

// close on outside click
function handleClickOutside(e: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    isDropdownOpen.value = false
    showRequests.value = false
  }
}

onMounted(() => document.addEventListener('mousedown', handleClickOutside))
onUnmounted(() => document.removeEventListener('mousedown', handleClickOutside))

// declare emits
const emit = defineEmits(['change-dark-mode'])
</script>

<style scoped>
/* all styling via Tailwind */
</style>

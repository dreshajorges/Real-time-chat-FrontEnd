<script setup lang="ts">

import Navbar from "../layouts/Navbar.vue";
import {onMounted, reactive, ref, watch} from "vue";
import {useAuthStore} from "../../stores/auth.ts";

const authStore = useAuthStore()
const isDarkMode = ref<boolean>(JSON.parse(localStorage.getItem('dark-mode') ?? 'false'))
const updateUserInfo = reactive({
      email : '',
      password : ''
    }
)

onMounted(() => {
  console.log(authStore.userInfo)
  console.log(authStore.userInfo.value)
})


watch(isDarkMode, (val) => {
  localStorage.setItem('dark-mode', JSON.stringify(val))
})

function changeDarkMode() {
  isDarkMode.value = !isDarkMode.value
}

</script>

<template>
  <Navbar @change-dark-mode="changeDarkMode"/>
  <div class="h-screen">
    <form>
      <div class="mb-4">
        <label
            :class="isDarkMode
              ? 'block mb-1 text-sm font-medium text-white'
              : 'block mb-1 text-sm font-medium'"
        >Name</label
        >
        <input
            type="text"
            required
            :class="isDarkMode
              ? 'text-white w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200'
              : 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200'"
        />
      </div>

      <div class="mb-4">
        <label
            :class="isDarkMode
              ? 'block mb-1 text-sm font-medium text-white'
              : 'block mb-1 text-sm font-medium'"
        >Surname</label
        >
        <input
            type="text"
            required
            :class="isDarkMode
              ? 'text-white w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200'
              : 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200'"
        />
      </div>

      <div class="mb-4">
        <label
            :class="isDarkMode
              ? 'block mb-1 text-sm font-medium text-white'
              : 'block mb-1 text-sm font-medium'"
        >Birthdate</label
        >
        <input
            type="date"
            required
            :class="isDarkMode
              ? 'text-white w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200'
              : 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200'"
        />
      </div>

      <div class="mb-4">
        <label
            :class="isDarkMode
              ? 'block mb-1 text-sm font-medium text-white'
              : 'block mb-1 text-sm font-medium'"
        >Gender</label
        >
        <select
            required
            :class="isDarkMode
              ? 'text-white w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200'
              : 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200'"
        >
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="OTHER">Other</option>
        </select>
      </div>

      <div class="mb-4">
        <label
            :class="isDarkMode
              ? 'block mb-1 text-sm font-medium text-white'
              : 'block mb-1 text-sm font-medium'"
        >Email</label
        >
        <input
            type="email"
            v-model="updateUserInfo.email"
            required
            :class="isDarkMode
              ? 'text-white w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200'
              : 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200'"
        />
      </div>

      <div class="mb-6">
        <label
            :class="isDarkMode
              ? 'block mb-1 text-sm font-medium text-white'
              : 'block mb-1 text-sm font-medium'"
        >Password</label
        >
        <input
            type="password"
            v-model="updateUserInfo.password"
            required
            :class="isDarkMode
              ? 'text-white w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200'
              : 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200'"
        />
      </div>

      <button
          type="submit"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-colors duration-200"
      >
        Update Credentials
      </button>
    </form>
  </div>
</template>

<style scoped>

</style>
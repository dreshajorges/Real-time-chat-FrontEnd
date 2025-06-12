<script setup lang="ts">
import {reactive, ref, watch} from 'vue'
import Navbar from "../layouts/Navbar.vue"
import {useAuthStore} from "../../stores/auth.ts"
import { useToast } from "vue-toastification"
import {useRouter} from "vue-router";


const authStore = useAuthStore()
const toast = useToast()
const router = useRouter()


const isLogin = ref<boolean>(true)

const signupFormData = reactive({
  name: '',
  surname: '',
  birthdate: '',
  gender: 'MALE',
  email: '',
  password: ''
})

const loginFormData = reactive({
  email: '',
  password: ''
})

function switchMode(): void {
  isLogin.value = !isLogin.value
}

async function signUp() {
  try {
    await authStore.signup(signupFormData)
    toast.success('Signed up successfully!')
    switchMode()
  } catch (e) {
    toast.error('Signup failed. Please try again.')
    console.error(e)
  }
}

async function logIn() {
  try {
    await authStore.logIn(loginFormData)
    toast.success('Logged in successfully!')
    await router.push('/chat-room');
  } catch (e) {
    toast.error('Login failed. Please check your credentials.')
    console.error(e)
  }
}

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

  <div
      :class="isDarkMode
      ? 'transition-colors duration-200 w-full min-h-screen flex items-center justify-center bg-dark-primary-color'
      : 'transition-colors duration-200 w-full min-h-screen flex items-center justify-center bg-gray-100'"
  >
    <div
        :class="isDarkMode
        ? 'transition-colors duration-200 bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-white'
        : 'transition-colors duration-200 bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-amber'"
    >
      <h2
          :class="isDarkMode
          ? 'transition-colors duration-200 text-3xl font-bold mb-6 text-center text-white'
          : 'transition-colors duration-200 text-3xl font-bold mb-6 text-center'"
      >
        {{ isLogin ? 'Sign Up' : 'Login' }}
      </h2>

      <!-- Sign Up Form -->
      <form @submit.prevent="signUp" v-if="isLogin">
        <div class="mb-4">
          <label
              :class="isDarkMode
              ? 'block mb-1 text-sm font-medium text-white'
              : 'block mb-1 text-sm font-medium'"
          >Name</label
          >
          <input
              type="text"
              v-model="signupFormData.name"
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
              v-model="signupFormData.surname"
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
              v-model="signupFormData.birthdate"
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
              v-model="signupFormData.gender"
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
              v-model="signupFormData.email"
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
              v-model="signupFormData.password"
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
          Sign Up
        </button>
      </form>

      <!-- Log In Form -->
      <form @submit.prevent="logIn" v-else>
        <div class="mb-4">
          <label
              :class="isDarkMode
              ? 'text-white block mb-1 text-sm font-medium'
              : 'block mb-1 text-sm font-medium'"
          >Email</label
          >
          <input
              type="email"
              v-model="loginFormData.email"
              required
              :class="isDarkMode
              ? 'text-white w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200'
              : 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200'"
          />
        </div>

        <div class="mb-6">
          <label
              :class="isDarkMode
              ? 'text-white block mb-1 text-sm font-medium'
              : 'block mb-1 text-sm font-medium'"
          >Password</label
          >
          <input
              type="password"
              v-model="loginFormData.password"
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
          Log In
        </button>
      </form>

      <p
          :class="isDarkMode
          ? 'transition-colors duration-200 mt-6 text-sm text-center text-white'
          : 'transition-colors duration-200 mt-6 text-sm text-center'"
      >
        {{ isLogin ? "Don't have an account?" : "Already have an account?" }}
        <button
            @click="switchMode"
            class="ml-1 text-blue-600 hover:underline font-medium cursor-pointer"
        >
          {{ isLogin ? "Login" : "Sign Up" }}
        </button>
      </p>
    </div>
  </div>
</template>

<style scoped>
</style>

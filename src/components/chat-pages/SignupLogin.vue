<script setup lang="ts">
import {ref, type Ref} from 'vue'

// Track login/signup toggle
const isLogin: Ref<boolean> = ref(true)

// Form fields
const name = ref<string>('')
const surname = ref<string>('')
const birthdate = ref<string>('')
const gender = ref<string>('MALE')
const email = ref<string>('')
const password = ref<string>('')

/**
 * Switch between Sign Up and Login modes
 */
function switchMode(): void {
  isLogin.value = !isLogin.value
}

/**
 * Handle user sign-up
 */
function signUp(): void {
  // TODO: implement sign-up logic
}

/**
 * Handle user log-in
 */
function logIn(): void {
  // TODO: implement log-in logic
}
</script>

<template>
  <div class="w-full min-h-screen flex items-center justify-center bg-gray-100">
    <!-- Card -->
    <div class="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
      <h2 class="text-3xl font-bold mb-6 text-center">
        {{ isLogin ? 'Sign Up' : 'Login' }}
      </h2>

      <!-- Sign Up Form -->
      <form @submit.prevent="signUp" v-if="isLogin">
        <div class="mb-4">
          <label class="block mb-1 text-sm font-medium">Name</label>
          <input
              type="text"
              v-model="name"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
          />
        </div>

        <div class="mb-4">
          <label class="block mb-1 text-sm font-medium">Surname</label>
          <input
              type="text"
              v-model="surname"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
          />
        </div>

        <div class="mb-4">
          <label class="block mb-1 text-sm font-medium">Birthdate</label>
          <input
              type="date"
              v-model="birthdate"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
          />
        </div>

        <div class="mb-4">
          <label class="block mb-1 text-sm font-medium">Gender</label>
          <select
              v-model="gender"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
          >
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div class="mb-4">
          <label class="block mb-1 text-sm font-medium">Email</label>
          <input
              type="email"
              v-model="email"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
          />
        </div>

        <div class="mb-6">
          <label class="block mb-1 text-sm font-medium">Password</label>
          <input
              type="password"
              v-model="password"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
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
          <label class="block mb-1 text-sm font-medium">Email</label>
          <input
              type="email"
              v-model="email"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
          />
        </div>

        <div class="mb-6">
          <label class="block mb-1 text-sm font-medium">Password</label>
          <input
              type="password"
              v-model="password"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
          />
        </div>

        <button
            type="submit"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-colors duration-200"
        >
          Log In
        </button>
      </form>

      <p class="mt-6 text-sm text-center">
        {{ isLogin ? "Don't have an account?" : "Already have an account?" }}
        <button
            @click="switchMode"
            class="ml-1 text-blue-600 hover:underline font-medium"
        >
          {{ isLogin ? "Sign Up" : "Login" }}
        </button>
      </p>
    </div>
  </div>
</template>

<style scoped>
</style>

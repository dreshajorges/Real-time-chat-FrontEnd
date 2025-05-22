<script setup lang="ts">
import { ref, onMounted, watchEffect } from 'vue'

// Track login/signup toggle
const isLogin = ref(true)

// Track dark mode state (init from localStorage)
const isDark = ref(false)
onMounted(() => {
  const storedTheme = localStorage.getItem('theme')
  isDark.value = storedTheme === 'dark'
})

// Toggle dark mode and store in localStorage
watchEffect(() => {
  const html = document.documentElement
  if (isDark.value) {
    html.classList.add('dark-mode')
    localStorage.setItem('theme', 'dark')
  } else {
    html.classList.remove('dark-mode')
    localStorage.setItem('theme', 'light')
  }
})
const toggleDark = () => {
  isDark.value = !isDark.value
}

// Form fields
const name = ref('')
const surname = ref('')
const birthdate = ref('')
const gender = ref('Male')
const email = ref('')
const password = ref('')

const switchMode = () => {
  isLogin.value = !isLogin.value
}

const login = () => {
  console.log('Logging in:', { email: email.value, password: password.value })
}

const signup = () => {
  console.log('Signing up:', {
    name: name.value,
    surname: surname.value,
    birthdate: birthdate.value,
    gender: gender.value,
    email: email.value,
    password: password.value
  })
}
</script>

<template>
  <div class="w-full min-h-screen flex items-center justify-center transition-colors duration-300 bg-gray-100 dark-page">
    <!-- Toggle button -->
    <div class="absolute top-4 right-4 z-10">
      <button
          @click="toggleDark"
          class="px-3 py-1 text-sm rounded bg-gray-800 text-white dark-toggle"
      >
        {{ isDark ? '☀️ Light Mode' : '🌙 Dark Mode' }}
      </button>
    </div>

    <!-- Card -->
    <div class="bg-white dark-toggle-bg p-8 rounded-2xl shadow-xl w-full max-w-md">
      <h2 class="text-3xl font-bold mb-6 text-center dark-toggle-text">
        {{ isLogin ? 'Login' : 'Sign Up' }}
      </h2>

      <form @submit.prevent="isLogin ? login() : signup()">
        <div v-if="!isLogin">
          <div class="mb-4">
            <label class="block mb-1 text-sm font-medium dark-toggle-text">Name</label>
            <input type="text" v-model="name" required class="input-field" />
          </div>
          <div class="mb-4">
            <label class="block mb-1 text-sm font-medium dark-toggle-text">Surname</label>
            <input type="text" v-model="surname" required class="input-field" />
          </div>
          <div class="mb-4">
            <label class="block mb-1 text-sm font-medium dark-toggle-text">Birthdate</label>
            <input type="date" v-model="birthdate" required class="input-field" />
          </div>
          <div class="mb-4">
            <label class="block mb-1 text-sm font-medium dark-toggle-text">Gender</label>
            <select v-model="gender" required class="input-field">
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div class="mb-4">
          <label class="block mb-1 text-sm font-medium dark-toggle-text">Email</label>
          <input type="email" v-model="email" required class="input-field" />
        </div>

        <div class="mb-6">
          <label class="block mb-1 text-sm font-medium dark-toggle-text">Password</label>
          <input type="password" v-model="password" required class="input-field" />
        </div>

        <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition">
          {{ isLogin ? 'Login' : 'Sign Up' }}
        </button>
      </form>

      <p class="mt-6 text-sm text-center dark-toggle-text">
        {{ isLogin ? "Don't have an account?" : "Already have an account?" }}
        <button @click="switchMode" class="ml-1 text-blue-600 hover:underline font-medium">
          {{ isLogin ? "Sign Up" : "Login" }}
        </button>
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Dark Mode Applied to <html> */
.dark-mode {
  background-color: #1a202c;
  color: white;
}

.dark-mode .dark-page {
  background-color: #1a202c !important;
}

.dark-mode .dark-toggle-bg {
  background-color: #2d3748 !important;
}

.dark-mode .dark-toggle-text {
  color: #e2e8f0 !important;
}

.dark-mode .input-field {
  background-color: #4a5568 !important;
  color: white !important;
  border-color: #718096 !important;
}

.input-field {
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  background-color: white;
  color: black;
  transition: background-color 0.3s, color 0.3s;
}
</style>

<!-- src/components/ProfilePage.vue -->
<script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import Navbar from "../layouts/Navbar.vue";
import { useAuthStore } from "../../stores/auth.ts";
import { useUserStore, type User } from "../../stores/user.ts";
import { useToast } from "vue-toastification";

const authStore = useAuthStore();
const userStore = useUserStore();
const toast = useToast();
const router = useRouter();

const isDarkMode = ref<boolean>(
    JSON.parse(localStorage.getItem("dark-mode") ?? "false")
);

// fetched profile fields (display-only)
const userData = reactive<User>({
  id: "",
  name: "",
  surname: "",
  birthdate: "",
  gender: "OTHER",
  email: ""
});

// for updating password only if provided
const updatePassword = reactive({
  password: ""
});

onMounted(async () => {
  if (!authStore.userInfo) return;
  const userId = authStore.userInfo.userId;

  try {
    const user = await userStore.getUserById(userId);
    userData.id = user.id;
    userData.name = user.name;
    userData.surname = user.surname;
    userData.birthdate = user.birthdate;
    userData.gender = user.gender;
    userData.email = user.email;
  } catch (err) {
    console.error("Failed to load user data:", err);
    toast.error("Could not load profile. Please try again.");
  }
});

watch(isDarkMode, (val) => {
  localStorage.setItem("dark-mode", JSON.stringify(val));
});

function changeDarkMode() {
  isDarkMode.value = !isDarkMode.value;
}

async function onSubmit() {
  if (!authStore.userInfo) return;
  const userId = authStore.userInfo.userId;

  // build payload: always include email; only add password if non-empty
  const payload: Partial<User> = { email: userData.email };
  if (updatePassword.password.trim() !== "") {
    payload.password = updatePassword.password;
  }

  try {
    await userStore.update(userId, payload);
    toast.success("Profile updated. Please log in again to continue.");

    // clear old auth state & token
    authStore.logOut();    // make sure this clears both userInfo and stored JWT
    router.push("/");
  } catch (err) {
    console.error("Failed to update profile:", err);
    toast.error("Could not update profile. Please try again.");
  }
}

  function goBack(){
  router.push("/chat-room");
  }
</script>

<template>
  <Navbar @change-dark-mode="changeDarkMode" />

  <p @click="goBack()" class="mx-4 my-4 cursor-pointer hover:text-blue-700">← Back</p>

  <div
      :class="[
      'h-[93vh] w-full flex items-center justify-center transition-colors duration-200',
      { 'bg-gray-900': isDarkMode }
    ]"
  >
    <form @submit.prevent="onSubmit" class="w-2/3 md:w-1/2 ">
      <!-- Name (readonly) -->
      <div class="mb-4">
        <label
            :class="isDarkMode
            ? 'block mb-1 text-sm font-medium text-white'
            : 'block mb-1 text-sm font-medium'"
        >
          Name
        </label>
        <input
            type="text"
            v-model="userData.name"
            disabled
            :class="[
            'w-full px-4 py-2 border rounded-lg focus:outline-none',
            isDarkMode
              ? 'text-white bg-gray-700 border-gray-600'
              : 'bg-gray-100 border-gray-300'
          ]"
        />
      </div>

      <!-- Surname (readonly) -->
      <div class="mb-4">
        <label
            :class="isDarkMode
            ? 'block mb-1 text-sm font-medium text-white'
            : 'block mb-1 text-sm font-medium'"
        >
          Surname
        </label>
        <input
            type="text"
            v-model="userData.surname"
            disabled
            :class="[
            'w-full px-4 py-2 border rounded-lg focus:outline-none',
            isDarkMode
              ? 'text-white bg-gray-700 border-gray-600'
              : 'bg-gray-100 border-gray-300'
          ]"
        />
      </div>

      <!-- Birthdate (readonly) -->
      <div class="mb-4">
        <label
            :class="isDarkMode
            ? 'block mb-1 text-sm font-medium text-white'
            : 'block mb-1 text-sm font-medium'"
        >
          Birthdate
        </label>
        <input
            type="date"
            v-model="userData.birthdate"
            disabled
            :class="[
            'w-full px-4 py-2 border rounded-lg focus:outline-none',
            isDarkMode
              ? 'text-white bg-gray-700 border-gray-600'
              : 'bg-gray-100 border-gray-300'
          ]"
        />
      </div>

      <!-- Gender (readonly) -->
      <div class="mb-4">
        <label
            :class="isDarkMode
            ? 'block mb-1 text-sm font-medium text-white'
            : 'block mb-1 text-sm font-medium'"
        >
          Gender
        </label>
        <select
            v-model="userData.gender"
            disabled
            :class="[
            'w-full px-4 py-2 border rounded-lg focus:outline-none',
            isDarkMode
              ? 'text-white bg-gray-700 border-gray-600'
              : 'bg-gray-100 border-gray-300'
          ]"
        >
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="OTHER">Other</option>
        </select>
      </div>

      <!-- Email (editable) -->
      <div class="mb-4">
        <label
            :class="isDarkMode
            ? 'block mb-1 text-sm font-medium text-white'
            : 'block mb-1 text-sm font-medium'"
        >
          Email
        </label>
        <input
            type="email"
            v-model="userData.email"
            :class="[
            'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
            isDarkMode
              ? 'text-white bg-gray-800 border-gray-600'
              : 'bg-white border-gray-300'
          ]"
        />
      </div>

      <!-- Password (editable) -->
      <div class="mb-6">
        <label
            :class="isDarkMode
            ? 'block mb-1 text-sm font-medium text-white'
            : 'block mb-1 text-sm font-medium'"
        >
          Password
        </label>
        <input
            type="password"
            v-model="updatePassword.password"
            placeholder="Enter new password if you want to change"
            :class="[
            'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
            isDarkMode
              ? 'text-white bg-gray-800 border-gray-600'
              : 'bg-white border-gray-300'
          ]"
        />
      </div>

      <!-- Submit -->
      <button
          type="submit"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-colors duration-200"
      >
        Update Profile
      </button>
    </form>
  </div>
</template>

<style scoped>
/* any extra scoped styles here */
</style>

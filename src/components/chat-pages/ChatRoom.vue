<template>
  <Navbar />
  <div class="flex h-[93vh]">
    <!-- FRIENDS SIDEBAR WITH SEARCH -->
    <aside class="w-1/5 border-r border-gray-300 p-4">
      <div class="mb-4">
        <input
            v-model="chatStore.searchQuery"
            @input="onSearch"
            placeholder="Search users by email..."
            autocomplete="off"
            class="w-full p-2 mb-2 border border-gray-300 rounded"
        />
        <ul
            v-if="chatStore.searchResults.length"
            class="bg-white border border-gray-300 max-h-48 overflow-y-auto list-none p-0 m-0"
        >
          <li
              v-for="u in chatStore.searchResults"
              :key="u.id"
              class="flex justify-between p-2 hover:bg-gray-100"
          >
            <span>{{ u.name }} {{ u.surname }} ({{ u.email }})</span>
            <button
                @click="addFriend(u.id)"
                class="ml-2 p-1 bg-green-500 text-white rounded"
            >
              Add
            </button>
          </li>
        </ul>
      </div>

      <h3 class="text-lg font-semibold mb-2">Your Friends</h3>
      <ul class="list-none p-0 m-0">
        <li
            v-for="f in chatStore.friends"
            :key="f.id"
            @click="selectFriend(f.email)"
            :class="[
            'p-2 cursor-pointer hover:bg-gray-100',
            f.email === chatStore.selectedFriend ? 'bg-gray-200' : ''
          ]"
        >
          {{ f.name }} {{ f.surname }}
        </li>
      </ul>
    </aside>

    <!-- CHAT WINDOW -->
    <section class="flex-1 flex flex-col">
      <div :class="!chatStore.selectedFriend ? 'bg-gray-100' : '' " ref="messageContainer" class="flex-1 p-4 overflow-y-auto flex flex-col justify-end space-y-2">

        <h1 v-if="!chatStore.selectedFriend" class="m-auto ">Select a friend to start chatting</h1>


        <div
            v-if="chatStore.selectedFriend"
            v-for="msg in chatStore.messages"
            :key="msg.timestamp + msg.from"
            :class="[
            'max-w-xs px-4 py-2 rounded-lg break-words',
            msg.from === me
              ? 'bg-blue-500 text-white self-end'
              : 'bg-gray-200 text-gray-900 self-start'
          ]"
        >

          <div class="text-sm font-semibold mb-1">{{ msg.from }}</div>
          <div class="text-base">{{ msg.content }}</div>

        </div>

      </div>

      <form @submit.prevent="send" class="flex p-4 border-t border-gray-300">
        <input
            v-model="newMessage"
            placeholder="Type your message…"
            autocomplete="off"
            class="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
            type="submit"
            :disabled="!newMessage.trim() || !chatStore.selectedFriend"
            class="ml-2 p-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { useChatStore } from '../../stores/chat.ts'
import WebSocketService from '../../helpers/websocket.ts'
import Navbar from '../layouts/Navbar.vue'

const chatStore = useChatStore()
const newMessage = ref('')
const messageContainer = ref<HTMLElement | null>(null)
const me = localStorage.getItem('name') || ''

let searchTimer: number;

function onSearch() {
  clearTimeout(searchTimer);
  const q = chatStore.searchQuery.trim();

  // only kick off once it looks like an email
  if (q.length < 3 || !q.includes('@')) {
    chatStore.searchResults = []
    return
  }

  searchTimer = window.setTimeout(() => {
    chatStore.searchUsers();
  }, 300);
}

function addFriend(id: number) {
  chatStore.addFriend(id)
}

function selectFriend(email: string) {
  chatStore.selectFriend(email)
}

function send() {
  const content = newMessage.value.trim()
  if (!content || !chatStore.selectedFriend) return

  chatStore.appendMessage({
    from:      me,
    to:        chatStore.selectedFriend,
    content,
    timestamp: Date.now(),
  })
  scrollToBottom()

  WebSocketService.sendPrivate({
    from:    me,
    to:      chatStore.selectedFriend,
    content,
  })

  newMessage.value = ''
}

function scrollToBottom() {
  nextTick(() => {
    if (messageContainer.value) {
      messageContainer.value.scrollTop = messageContainer.value.scrollHeight
    }
  })
}

// auto-scroll when messages change
watch(() => chatStore.messages.length, scrollToBottom)

onMounted(() => {
  chatStore.loadFriends()

  WebSocketService.connect(
      localStorage.getItem('token') || '',
      me,
      msg => chatStore.appendMessage(JSON.parse(msg.body)),
      msg => chatStore.appendMessage(JSON.parse(msg.body))
  )
})

onBeforeUnmount(() => {
  WebSocketService.disconnect()
})
</script>


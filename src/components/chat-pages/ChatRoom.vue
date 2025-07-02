<template>
  <Navbar />
  <div class="flex h-screen">
    <!-- FRIENDS SIDEBAR WITH SEARCH -->
    <aside class="w-1/5 border-r border-gray-300 p-4">
      <div class="mb-4">
        <input
            v-model="searchQuery"
            @input="onSearch"
            placeholder="Search users…"
            autocomplete="off"
            class="w-full p-2 mb-2 border border-gray-300 rounded"
        />
        <ul v-if="searchResults.length" class="bg-white border border-gray-300 max-h-48 overflow-y-auto list-none p-0 m-0">
          <li
              v-for="u in searchResults"
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
            v-for="f in friends"
            :key="f.id"
            :class="[
            'p-2 cursor-pointer hover:bg-gray-100',
            f.email === selectedFriend ? 'bg-gray-200' : ''
          ]"
            @click="selectFriend(f.email)"
        >
          {{ f.name }} {{ f.surname }} ({{ f.email }})
        </li>
      </ul>
    </aside>

    <!-- CHAT WINDOW -->
    <section class="flex-1 flex flex-col">
      <!-- Messages container: reversed flex to start at bottom -->
      <div
          ref="messageContainer"
          class="flex-1 p-4 overflow-y-auto flex flex-col justify-end space-y-2"
      >
        <div
            v-for="msg in messages"
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
            :disabled="!newMessage || !selectedFriend"
            class="ml-2 p-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import axios from 'axios';
import WebSocketService from '../../helpers/websocket.ts';
import Navbar from "../layouts/Navbar.vue";

interface Friend {
  id: number;
  name: string;
  surname: string;
  email: string;
}

interface ChatMessage {
  from: string;
  to?: string;
  content: string;
  timestamp: number;
}

interface HistoryRecord {
  id: number;
  type: 'CHAT' | 'PRIVATE' | 'JOIN';
  fromUser: string;
  toUser: string | null;
  content: string;
  timestamp: string;
}

const me = localStorage.getItem('name') || '';
const token = localStorage.getItem('token') || '';

const searchQuery = ref('');
const searchResults = ref<Friend[]>([]);
let searchTimer: number;

const friends = ref<Friend[]>([]);
const selectedFriend = ref<string>('');
const messages = ref<ChatMessage[]>([]);
const newMessage = ref('');
const messageContainer = ref<HTMLElement | null>(null);

function loadFriends() {
  axios
      .get<Friend[]>('http://localhost:8080/api/chat/users/friends', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => { friends.value = res.data; })
      .catch(() => { friends.value = []; });
}

function onSearch() {
  clearTimeout(searchTimer);
  const q = searchQuery.value.trim();
  if (!q) { searchResults.value = []; return; }
  searchTimer = window.setTimeout(() => {
    axios
        .get<Friend[]>('http://localhost:8080/api/chat/users/search', {
          params: { q },
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(res => { searchResults.value = res.data; })
        .catch(() => { searchResults.value = []; });
  }, 300);
}

function addFriend(friendId: number) {
  axios
      .post(`http://localhost:8080/api/chat/users/${friendId}/friends`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        searchResults.value = [];
        searchQuery.value = '';
        loadFriends();
      });
}

function onPublic(msg: any) {
  messages.value.push(JSON.parse(msg.body));
  scrollToBottom();
}
function onPrivate(msg: any) {
  messages.value.push(JSON.parse(msg.body));
  scrollToBottom();
}

function send() {
  const content = newMessage.value.trim();
  if (!content || !selectedFriend.value) return;

  // 1) Immediately append to history
  const msg: ChatMessage = {
    from: me,
    to: selectedFriend.value,
    content,
    timestamp: Date.now(),
  };
  messages.value.push(msg);
  scrollToBottom();

  // 2) Send over WebSocket
  WebSocketService.sendPrivate({
    from: me,
    to: selectedFriend.value,
    content,
  });

  // 3) Clear input
  newMessage.value = '';
}


async function loadHistory() {
  if (!selectedFriend.value) return;

  const res = await axios.get<HistoryRecord[]>(
      `http://localhost:8080/api/chat/history/${encodeURIComponent(selectedFriend.value)}`,
      { headers: { Authorization: `Bearer ${token}` } }
  );

  messages.value = res.data.map(h => ({
    from: h.fromUser,
    to: h.toUser ?? undefined,
    content: h.content,
    timestamp: new Date(h.timestamp).getTime(),
  }));
  await nextTick();
  scrollToBottom();
}

function selectFriend(email: string) {
  selectedFriend.value = email;
  messages.value = [];
  loadHistory();
}

function scrollToBottom() {
  nextTick(() => {
    if (messageContainer.value) {
      messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
    }
  });
}

onMounted(() => {
  loadFriends();
  WebSocketService.connect(token, me, onPublic, onPrivate);
});

onBeforeUnmount(() => {
  WebSocketService.disconnect();
});
</script>


<!--me i bo api calls me ni store edhe me nreq ngrokin-->
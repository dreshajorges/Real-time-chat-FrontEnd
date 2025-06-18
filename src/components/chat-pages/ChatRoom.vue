<template>
  <Navbar />
  <div class="chat-container">
    <!-- FRIENDS SIDEBAR WITH SEARCH -->
    <aside class="friends-list">
      <div class="search-add">
        <input
            v-model="searchQuery"
            @input="onSearch"
            placeholder="Search users…"
            autocomplete="off"
        />
        <ul v-if="searchResults.length" class="search-results">
          <li v-for="u in searchResults" :key="u.id">
            {{ u.name }} ({{ u.email }})
            <button @click="addFriend(u.id)">Add</button>
          </li>
        </ul>
      </div>

      <h3>Your Friends</h3>
      <ul>
        <li
            v-for="f in friends"
            :key="f.id"
            :class="{ selected: f.email === selectedFriend }"
            @click="selectFriend(f.email)"
        >
          {{ f.name }} ({{ f.email }})
        </li>
      </ul>
    </aside>

    <!-- CHAT WINDOW -->
    <section class="chat-window">
      <div class="messages">
        <div
            v-for="msg in messages"
            :key="msg.timestamp + msg.from"
            :class="['message', msg.from === me ? 'outgoing' : 'incoming']"
        >
        </div>
      </div>

      <form @submit.prevent="send" class="message-form">
        <input v-model="newMessage" placeholder="Type your message…" autocomplete="off" />
        <button type="submit" :disabled="!newMessage || !selectedFriend">Send</button>
      </form>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import axios from 'axios';
import WebSocketService from '../../helpers/websocket.ts';
import Navbar from "../layouts/Navbar.vue";

interface Friend {
  id: number;
  name: string;
  email: string;
}

interface ChatMessage {
  from: string;
  to?: string;
  content: string;
  timestamp: number;
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

function selectFriend(email: string) {
  selectedFriend.value = email;
}

function onPublic(msg: any) {
  messages.value.push(JSON.parse(msg.body));
}
function onPrivate(msg: any) {
  messages.value.push(JSON.parse(msg.body));
}

function send() {
  WebSocketService.sendPrivate({ from: me, to: selectedFriend.value, content: newMessage.value.trim() });
  newMessage.value = '';
}

onMounted(() => {
  loadFriends();
  WebSocketService.connect(token, me, onPublic, onPrivate);
});

onBeforeUnmount(() => {
  WebSocketService.disconnect();
});
</script>

<style scoped>
.chat-container {
  display: flex;
  height: 100vh;
}

/* FRIENDS SIDEBAR */
.friends-list {
  width: 250px;
  border-right: 1px solid #ccc;
  padding: 1rem;
  box-sizing: border-box;
}

/* SEARCH ADD */
.search-add {
  margin-bottom: 1rem;
}
.search-add input {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  box-sizing: border-box;
}
.search-results {
  background: #fff;
  border: 1px solid #ccc;
  max-height: 200px;
  overflow-y: auto;
  list-style: none;
  padding: 0;
  margin: 0;
}
.search-results li {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
}

/* FRIEND ITEMS */
.friends-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.friends-list li {
  padding: 0.5rem;
  cursor: pointer;
}
.friends-list li.selected {
  background: #e0e0e0;
}

/* CHAT WINDOW */
.chat-window {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.messages {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
}
.message {
  margin-bottom: 0.5rem;
}
.message.outgoing {
  text-align: right;
}

/* MESSAGE FORM */
.message-form {
  display: flex;
  padding: 1rem;
  border-top: 1px solid #ccc;
}
.message-form input {
  flex: 1;
  padding: 0.5rem;
}
.message-form button {
  margin-left: 0.5rem;
  padding: 0.5rem 1rem;
}
</style>

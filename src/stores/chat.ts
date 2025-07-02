import { defineStore } from 'pinia'
import axios from 'axios'

export interface Friend {
    id: number
    name: string
    surname: string
    email: string
}

export interface ChatMessage {
    from: string
    to?: string
    content: string
    timestamp: number
}

interface HistoryRecord {
    id: number
    type: 'CHAT' | 'PRIVATE' | 'JOIN'
    fromUser: string
    toUser: string | null
    content: string
    timestamp: string
}

export const useChatStore = defineStore('chat', {
    state: () => ({
        friends: [] as Friend[],
        searchResults: [] as Friend[],
        messages: [] as ChatMessage[],
        selectedFriend: '' as string,
        searchQuery: '' as string,
    }),
    actions: {
        get token() {
            return localStorage.getItem('token') ?? ''
        },

        async loadFriends() {
            try {
                const res = await axios.get<Friend[]>(
                    'http://localhost:8080/api/chat/users/friends',
                    { headers: { Authorization: `Bearer ${this.token}` } }
                )
                this.friends = res.data
            } catch {
                this.friends = []
            }
        },

        async searchUsers() {
            const q = this.searchQuery.trim()
            if (!q) {
                this.searchResults = []
                return
            }
            try {
                const res = await axios.get<Friend[]>(
                    'http://localhost:8080/api/chat/users/search',
                    {
                        params: { q },
                        headers: { Authorization: `Bearer ${this.token}` },
                    }
                )
                this.searchResults = res.data
            } catch {
                this.searchResults = []
            }
        },

        async addFriend(friendId: number) {
            if (!friendId) return
            try {
                await axios.post(
                    `http://localhost:8080/api/chat/users/${friendId}/friends`,
                    {},
                    { headers: { Authorization: `Bearer ${this.token}` } }
                )
                this.searchResults = []
                this.searchQuery = ''
                await this.loadFriends()
            } catch {
                // optionally handle error
            }
        },

        async loadHistory() {
            if (!this.selectedFriend) return
            try {
                const res = await axios.get<HistoryRecord[]>(
                    `http://localhost:8080/api/chat/history/${encodeURIComponent(
                        this.selectedFriend
                    )}`,
                    { headers: { Authorization: `Bearer ${this.token}` } }
                )
                this.messages = res.data.map(h => ({
                    from: h.fromUser,
                    to: h.toUser ?? undefined,
                    content: h.content,
                    timestamp: new Date(h.timestamp).getTime(),
                }))
            } catch {
                this.messages = []
            }
        },

        selectFriend(email: string) {
            this.selectedFriend = email
            this.messages = []
            this.loadHistory()
        },

        appendMessage(msg: ChatMessage) {
            this.messages.push(msg)
        },
    },
})

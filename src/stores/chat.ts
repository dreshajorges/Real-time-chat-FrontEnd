import { defineStore } from 'pinia'
import { ref } from 'vue'
import client from '../helpers/client'  // your axios instance with Authorization interceptor

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

export const useChatStore = defineStore('chat', () => {

    const url = "http://localhost:8080/api/chat/"

    const searchQuery    = ref<string>('')
    const searchResults  = ref<Friend[]>([])
    const friends        = ref<Friend[]>([])
    const selectedFriend = ref<string>('')
    const messages       = ref<ChatMessage[]>([])

    /** Load only *my* friends.  We map down to Friend DTO here to drop nested loops. */
    async function loadFriends(): Promise<void> {
        try {
            const res = await client.get<any[]>(`${url}users/friends`)
            friends.value = res.data.map(u => ({
                id:      u.id,
                name:    u.name,
                surname: u.surname,
                email:   u.email
            }))
        } catch {
            friends.value = []
        }
    }

    /** Search users by name/email — again flatten to Friend. */
    async function searchUsers(): Promise<void> {
        const q = searchQuery.value.trim()
        if (!q) {
            searchResults.value = []
            return
        }
        try {
            const res = await client.get<any[]>(`${url}users/search`, { params: { q } })
            searchResults.value = res.data.map(u => ({
                id:      u.id,
                name:    u.name,
                surname: u.surname,
                email:   u.email
            }))
        } catch {
            searchResults.value = []
        }
    }

    /** Hit the add‐friend endpoint & refresh */
    async function addFriend(friendId: number): Promise<void> {
        if (!friendId) return
        try {
            await client.post(`${url}users/${friendId}/friends`)
            searchResults.value = []
            searchQuery.value   = ''
            await loadFriends()
        } catch {
            // handle if you like
        }
    }

    /** Load chat history with the selected friend */
    async function loadHistory(): Promise<void> {
        if (!selectedFriend.value) {
            messages.value = []
            return
        }
        try {
            const res = await client.get<HistoryRecord[]>(
                `${url}history/${encodeURIComponent(selectedFriend.value)}`
            )
            messages.value = res.data.map(h => ({
                from:      h.fromUser,
                to:        h.toUser   ?? undefined,
                content:   h.content,
                timestamp: new Date(h.timestamp).getTime(),
            }))
        } catch {
            messages.value = []
        }
    }

    /** Pick a friend & fetch his history */
    function selectFriend(email: string): void {
        selectedFriend.value = email
        messages.value       = []
        loadHistory()
    }

    /** Append a message (public or private) */
    function appendMessage(msg: ChatMessage): void {
        messages.value.push(msg)
    }

    return {
        // state
        searchQuery,
        searchResults,
        friends,
        selectedFriend,
        messages,
        // actions
        loadFriends,
        searchUsers,
        addFriend,
        loadHistory,
        selectFriend,
        appendMessage,
    }
})

import { defineStore } from 'pinia'
import { ref } from 'vue'
import client from '../helpers/client'
import {useChatStore} from "./chat.ts";


/** Mirror your backend’s FriendRequestDto shape exactly */
export interface FriendRequestDto {
    requestId:   number
    requesterId: number
    name:        string
    surname:     string
    email:       string
}

export const useRequestStore = defineStore('request', () => {
    const pendingRequests = ref<FriendRequestDto[]>([])
    const url = 'http://localhost:8080/api/chat/requests'
    const chatStore = useChatStore()

    /** Send a new friend‑request */
    async function sendRequest(recipientId: number): Promise<void> {
        try {
            await client.post(`${url}/${recipientId}`)
            // optionally reload your own outgoing list...
        } catch (e) {
            console.error('Failed to send friend request', e)
        }
    }

    /** Load *incoming* pending friend‑requests for me */
    async function loadRequests(): Promise<void> {
        try {
            const res = await client.get<FriendRequestDto[]>(url)
            pendingRequests.value = res.data
        } catch {
            pendingRequests.value = []
        }
    }

    /** **FIXED**: use the function parameter `requestId`, not some un‑scoped `req` */
    async function acceptRequest(requestId: number): Promise<void> {
        try {
            await client.post(`${url}/${requestId}/accept`)
            await loadRequests()
            await chatStore.loadFriends()
        } catch (e) {
            console.error('Failed to accept request', e)
        }
    }

    /** same here */
    async function declineRequest(requestId: number): Promise<void> {
        try {
            await client.post(`${url}/${requestId}/decline`)
            await loadRequests()
        } catch (e) {
            console.error('Failed to decline request', e)
        }
    }

    return {
        pendingRequests,
        sendRequest,
        loadRequests,
        acceptRequest,
        declineRequest,
    }
})

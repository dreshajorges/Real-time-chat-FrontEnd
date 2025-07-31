// src/stores/user.ts
import { defineStore } from "pinia";
import client from "../helpers/client";   // your axiosInstance with interceptor

export interface User {
    id: string;
    name: string;
    surname: string;
    birthdate: string;              // ISO date string, e.g. "1990-12-31"
    gender: "MALE" | "FEMALE" | "OTHER";
    email?: string;                 // optional when updating
    password?: string;              // optional when updating
}

export const useUserStore = defineStore("user", () => {
    const baseUrl = "http://localhost:8080/api/chat/users/";

    /** Fetch a user by numeric ID (your JWT’s `userId` claim). */
    async function getUserById(id: string | number): Promise<User> {
        const { data } = await client.get<User>(`${baseUrl}${id}`);
        return data;
    }

    /** Update only the fields you pass in. */
    async function update(
        id: string | number,
        user: Partial<User>
    ): Promise<User> {
        const { data } = await client.put<User>(`${baseUrl}${id}`, user);
        return data;
    }

    return {
        getUserById,
        update,
    };
});

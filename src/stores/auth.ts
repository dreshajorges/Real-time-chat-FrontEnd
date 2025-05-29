import {defineStore} from "pinia";
import {ref} from "vue";
import client from "../helpers/client.ts";
import {jwtDecode} from "jwtDecode"

export const useAuthStore = defineStore('auth', ()=>{

    const url : string = "http://localhost:8080/api/chat/auth/"
    const token : string = ref(localStorage.getItem('token') || null)

    async function signup(user : any){

        const response = await client.post(`${url}/auth/register`, user);

        console.log(response);

    }

    async function logIn(user : any) {
        const response = await client.post(`${url}/auth/login`, user)

        if (response.data) {
            localStorage.setItem('token', response.data.token)
            token.value = response.data.token;

            const decodedToken = jwtDecode(token.value);
            const name = decodedToken.sub;

            localStorage.setItem('name', name);

        }
        console.log(response)
    }


    return{signup, logIn}
})
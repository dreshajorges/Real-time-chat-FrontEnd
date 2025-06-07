import {defineStore} from "pinia";
import {ref} from "vue";
import client from "../helpers/client.ts";
import {jwtDecode, type JwtPayload} from "jwt-decode"

export const useAuthStore = defineStore('auth', ()=>{

    const url : string = "http://localhost:8080/api/chat/auth/"
    const token = ref<string | null>(localStorage.getItem('token'))


    async function signup(user : any) : Promise<void> {

        const response = await client.post(`${url}signup`, user);

        console.log(response);

    }

    async function logIn(user : any) : Promise<void> {
        const response = await client.post(`${url}login`, user)

        if (response.data) {
            localStorage.setItem('token', response.data.token)
            token.value = response.data.token;

            const decodedToken = jwtDecode<JwtPayload>(token.value!);

            const name = decodedToken.sub;

            if (name != null) { //me kqyr qita nese nuk bon diqka me login
                localStorage.setItem('name', name);
            }

        }
        console.log(response)
    }


    return{signup, logIn, token}
})
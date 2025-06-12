import {defineStore} from "pinia";
import {computed, ref} from "vue";
import client from "../helpers/client.ts";
import {jwtDecode} from "jwt-decode"

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

            const decodedToken = jwtDecode(token.value!);

            const name = decodedToken.sub;

            if (name != null) { //me kqyr qita nese nuk bon diqka me login
                localStorage.setItem('name', name);
            }

        }
        console.log(response)
    }

    function logOut() {
        if (isLoggedIn.value) {
            localStorage.removeItem('token');
            token.value = null;

            localStorage.removeItem('name');

        }
    }


    const isLoggedIn = computed(() => {
        return !!token.value;
    })


    const isAdmin = computed(() => {
        if (token.value) {
            try {
                const decodedToken = jwtDecode(token.value);
                return decodedToken.role === 'ADMIN';
            } catch (error) {
                console.error("Failed to decode token:", error);
                return false;
            }
        }
        return false;
    });


    return{signup, logIn, token, isLoggedIn, isAdmin, logOut}
})
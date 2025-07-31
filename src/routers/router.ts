import {createRouter, createWebHistory} from "vue-router";
import SignupLogin from "../components/chat-pages/SignupLogin.vue";
import ChatRoom from "../components/chat-pages/ChatRoom.vue";
import {useAuthStore} from "../stores/auth.ts";
import {useToast} from "vue-toastification";
import Profile from "../components/chat-pages/Profile.vue";

const toast = useToast()

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {path: '', name: 'SignupLogin', component: SignupLogin, meta: {guest: true}},
        {path: '/chat-room', name: 'ChatRoom', component: ChatRoom, meta: {requiresAuth: true}},
        {path: '/profile', name: 'Profile', component: Profile, meta: {requiresAuth: true}}

    ]
})

router.beforeEach((to) => {
    const authStore = useAuthStore();

    if (to.meta.requiresAuth && !authStore.isLoggedIn) {
        toast.error('Unauthorized Access. Please login first.');

        return{
            name: 'SignupLogin',
            query: {redirect: to.fullPath}
        };
    }

    if (to.meta.guest && authStore.isLoggedIn) {
        return {name: 'ChatRoom'}
    }

    return true
})

export default router;
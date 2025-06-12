import {createRouter, createWebHistory} from "vue-router";
import SignupLogin from "../components/chat-pages/SignupLogin.vue";
import ChatRoom from "../components/chat-pages/ChatRoom.vue";
import {useAuthStore} from "../stores/auth.ts";
import {useToast} from "vue-toastification";

const toast = useToast()

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {path: '', name: 'SignupLogin', component: SignupLogin, meta: {requiresAuth: false}},
        {path: '/chat-room', name: 'ChatRoom', component: ChatRoom, meta: {requiresAuth: true}}
    ]
})

router.beforeEach((to,_from, next) => {
    const authStore = useAuthStore();

    if (to.meta.requiresAuth && !authStore.isLoggedIn) {
        toast.error('Unauthorized Access');

        next({
            name: 'SignupLogin',
            query: {redirect: to.fullPath}
        });
    } else {
        next()
    }
})

export default router;
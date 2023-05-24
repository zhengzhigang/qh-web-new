import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
// import Layout from '../components/HelloWorld.vue'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: {
            name: 'home'
        }
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/login.vue')
    },
    // {
    //     path: '/match_author',
    //     name: 'match_author',
    //     component: () => import('../views/startMatch.vue')
    // },
    {
        path: '/author',
        name: 'author',
        component: () => import('../views/author.vue')
    },
    {
        path: '/home',
        name: 'home',
        component: () => import('../views/home/index.vue')
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router

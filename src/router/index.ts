import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
// import Layout from '../components/HelloWorld.vue'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: {
            name: 'match_author'
        }
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/login.vue')
    },
    {
        path: '/match_author',
        name: 'match_author',
        component: () => import('../views/startMatch.vue')
    },
    {
        path: '/author',
        name: 'author',
        component: () => import('../views/author.vue')
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router

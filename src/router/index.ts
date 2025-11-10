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
    {
        path: '/canvas',
        name: 'canvas',
        component: () => import('../views/home/canvas.vue')
    },
    {
        path: '/tag',
        name: 'tag',
        component: () => import('../views/home/tag.vue'),
        children: [

        ]
    },
    {
        path: '/timeScroll',
        name: 'timeScroll',
        component: () => import('../views/home/timeScroll.vue'),
        children: [

        ]
    },
    {
        path: '/timeScrollHistory',
        name: 'timeScrollHistory',
        component: () => import('../views/time-scroll/History.vue')
    },
    {
        path: '/timeScrollPerson',
        name: 'timeScrollPerson',
        component: () => import('../views/time-scroll/Person.vue')
    },
    {
        path: '/listStatusAuthorPageByStatusCode',
        name: 'listStatusAuthorPageByStatusCode',
        component: () => import('../views/home/tagAuthor.vue')
    },
    {
        path: '/buddhism',
        name: 'buddhism',
        component: () => import('../views/buddhism/index.vue')
    },
    {
        path: '/buddhism/detail',
        name: 'buddhismDetail',
        component: () => import('../views/buddhism/detail.vue')
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router

import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('@/views/IndexPage.vue'),
    },
    {
      path: '/notes',
      name: 'notes',
      component: () => import('@/views/notes/NotesList.vue'),
    },
    {
      path: '/notes/:id',
      name: 'note',
      component: () => import('@/views/notes/NoteDetail.vue'),
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/SettingsPage.vue'),
    },
  ],
})

export default router

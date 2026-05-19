import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import InformationView from '../views/InformationView.vue'
import ProgramView from '../views/ProgramView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/:inviteCode([A-Za-z0-9]{4})',
      name: 'invite-code',
      component: HomeView,
    },
    {
      path: '/:inviteCode([A-Za-z0-9]{4})/program',
      name: 'invite-program',
      component: ProgramView,
    },
    {
      path: '/:inviteCode([A-Za-z0-9]{4})/information',
      name: 'invite-information',
      component: InformationView,
    },
    {
      path: '/program',
      name: 'program',
      component: ProgramView,
    },
    {
      path: '/information',
      name: 'information',
      component: InformationView,
    },
  ],
})

export default router
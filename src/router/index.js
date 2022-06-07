import VueRouter from 'vue-router';

const routes = [
  {
    path: '/', 
    redirect: '/preview'
  },
  {
    path: '/preview',
    name: 'preview',
    meta: { title: '预览' },
    component: () => import('@/views/preview/index.vue')
  }
];
const router = new VueRouter({
  mode: 'hash',
  routes
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title;
  next();
});

export default router;

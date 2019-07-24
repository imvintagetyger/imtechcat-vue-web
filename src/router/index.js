import Vue from 'vue'
import Router from 'vue-router'
import HomeLayout from '../views/layout/Layout.vue'
import { getToken } from '@/utils/auth'
import store from '@/store'

Vue.use(Router)

const whiteList = ['/', '/login', '/search', '/about', '/bookmark', '/tags']

export const constantRouteMap = [
  {
    path: '/',
    name: 'index',
    component: () => import('../views/Index.vue')
  },
  {
    path: '/post/:id',
    name: 'postDetail',
    component: () => import('../views/PostDetail.vue')
  },
  {
    path: '/tags/post/:tagName',
    name: 'postTagName',
    component: () => import('../views/PostTagName.vue')
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('../views/Search.vue')
  },
  {
    path: '/bookmark',
    name: 'bookmark',
    component: () => import('../views/Bookmark.vue')
  },
  {
    path: '/tags',
    name: 'tags',
    component: () => import('../views/Tags.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/About.vue')
  },
  {
    path: '/home',
    component: HomeLayout,
    redirect: '/home/bookmarks',
    children: [
      {
        path: 'bookmarks',
        component: () => import('../views/home/Bookmarks.vue')
      },
      {
        path: 'tags',
        component: () => import('../views/home/Tags.vue')
      },
      {
        path: 'blog',
        component: () => import('../views/home/blog/BlogList.vue')
      },
      {
        path: 'blog-new',
        component: () => import('../views/home/blog/NewBlog.vue')
      },
      {
        path: 'setting',
        component: () => import('../views/home/Set.vue')
      },
      {
        path: 'timeline',
        component: () => import('../views/home/Timeline.vue')
      }
    ]
  }
]

let router = new Router({
  routes: constantRouteMap
})

router.beforeEach((to, from, next) => {
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/home' })
    } else {
      if (!store.getters.userId) {
        store.dispatch('getUserInfo').then(() => {
          next({ ...to, replace: true })
        })
      }
      next()
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1 || to.path.startsWith('/post/') || to.path.startsWith('/tags/post/')) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
    }
  }
})

router.afterEach((to, from, next) => {
  setTimeout(() => {
    var _hmt = window._hmt || [];
    (function () {
      document.getElementById('baidu_tj') && document.getElementById('baidu_tj').remove()
      var hm = document.createElement('script')
      hm.src = 'https://hm.baidu.com/hm.js?57b35596da318b1076a18c694f0ed9a2'
      hm.id = 'baidu_tj'
      var s = document.getElementsByTagName('script')[0]
      s.parentNode.insertBefore(hm, s)
    })()
  }, 0)
})

export default router
import Vue from 'vue';
import VueRouter from 'vue-router';
/*@TODO remove*/
import Testing from '@/views/Testing.vue';
import NewsFeed from '@/views/NewsFeed.vue';
import Blog from '@/views/Blog.vue';
import Community from '@/views/Community.vue';
import MyCommunities from '@/views/MyCommunities.vue';
import Followers from '@/views/Followers.vue';
import Following from '@/views/Following';
import Blocking from '@/views/Blocking';
import CommunityCreateCommunity from '@/components/Community/CommunityCreateCommunity';
import Tagged from '@/views/Tagged';
import TaggedBlogPosts from '@/components/Tagged/TaggedBlogPosts';
import TaggedBlogs from '@/components/Tagged/TaggedBlogs';
import TaggedCommunities from '@/components/Tagged/TaggedCommunities';
import TagShow from '@/views/TagShow';
import TagEdit from '@/views/TagEdit';
import Likes from '@/views/Likes';
import LikesBlogPosts from '@/components/Likes/LikesBlogPosts';
import LikesComments from '@/components/Likes/LikesComments';
import Invites from '@/views/Invites';
import Activities from '@/views/Activities';
import Settings from '@/views/Settings';
import AuthSettings from '@/components/Auth/AuthSettings.vue';
import BlogSettings from '@/components/Blog/BlogSettings';
import BlogPrivacyGroup from '@/components/Blog/BlogPrivacyGroup';
import EmptyRouter from '@/views/EmptyRouter';
import store from '@/store/index';

Vue.use(VueRouter);

const orderParam = ':order(liked|commented|reblogged)?';
const paginationParam = ':pagination(\\d+)?';
const commonParams = `${orderParam}/${paginationParam}`;

const authenticatedRouteParams = {
  meta: { authentication: true },
  beforeEnter(to, from, next) {
    next({
      ...(!store.state.auth.isAuthenticated && { name: 'home' })
    });
  }
};

const routes = [
  {
    path: '/',
    name: 'home',
    component: NewsFeed,
    meta: { createPost: true, page: 'home' },
    children: [
      {
        path: 'post/:postId',
        name: 'home-with-blog-post',
        props: true,
        meta: { createPost: true, page: 'home' }
      }
    ]
  },
  {
    path: '/testing',
    name: 'testing',
    component: Testing
  },
  {
    path: '/blog',
    component: EmptyRouter,
    children: [
      {
        path: `:name/${commonParams}`,
        name: 'blog',
        props: true,
        meta: { createPost: true, page: 'blog' },
        component: Blog,
        children: [
          {
            path: 'post/:postId',
            name: 'blog-with-blog-post',
            props: true,
            meta: { createPost: true, page: 'blog' },
            component: Blog
          }
        ]
      },
      {
        path: `:name/tags/:tagNames/${commonParams}`,
        name: 'blog-by-tags',
        props: true,
        meta: { createPost: true, page: 'blog-by-tags' },
        component: Blog,
        children: [
          {
            path: 'post/:postId',
            name: 'blog-by-tags-with-blog-post',
            props: true,
            meta: { createPost: true, page: 'blog-by-tags' },
            component: Blog
          }
        ]
      },
      {
        path: ':name/edit',
        name: 'edit-blog',
        props: true,
        meta: { createPost: true, page: 'blog' },
        component: Blog
      }
    ]
  },
  {
    path: '/blog/:name/likes/',
    props: true,
    component: Likes,
    children: [
      {
        path: commonParams,
        name: 'blog-likes',
        props: true,
        meta: {
          showPost: true,
          main: 'likes',
          page: 'blog-likes',
          tabIndex: 0
        },
        component: LikesBlogPosts,
        children: [
          {
            path: 'post/:postId',
            name: 'blog-likes-with-blog-post',
            props: true,
            meta: {
              showPost: true,
              main: 'likes',
              page: 'blog-likes',
              tabIndex: 0
            }
          }
        ]
      },
      {
        path: `tags/:tagNames/${commonParams}`,
        name: 'blog-likes-by-tags',
        props: true,
        meta: {
          showPost: true,
          main: 'likes',
          page: 'blog-likes-by-tags',
          tabIndex: 0
        },
        component: LikesBlogPosts,
        children: [
          {
            path: 'post/:postId',
            name: 'blog-likes-by-tags-with-blog-post',
            props: true,
            meta: {
              showPost: true,
              main: 'likes',
              page: 'blog-likes-by-tags',
              tabIndex: 0
            },
            component: LikesBlogPosts
          }
        ]
      },
      {
        path: 'comments/:pagination(\\d+)?',
        name: 'blog-likes-comments',
        props: true,
        meta: {
          showPost: true,
          main: 'likes',
          page: 'blog-likes-comments',
          tabIndex: 1
        },
        component: LikesComments,
        children: [
          {
            path: 'post/:postId',
            name: 'blog-likes-comments-with-blog-post',
            props: true,
            meta: {
              showPost: true,
              main: 'likes',
              page: 'blog-likes-comments',
              tabIndex: 1
            }
          }
        ]
      }
    ]
  },
  {
    path: '/community',
    component: EmptyRouter,
    children: [
      {
        path: 'create',
        name: 'create-community',
        component: CommunityCreateCommunity
      },
      {
        path: `:id/${commonParams}`,
        name: 'community',
        props: true,
        meta: { createPost: true, page: 'community' },
        component: Community,
        children: [
          {
            path: 'post/:postId',
            name: 'community-with-blog-post',
            props: true,
            meta: { createPost: true, page: 'community' },
            component: Community
          }
        ]
      },
      {
        path: `:id/tags/:tagNames/${commonParams}`,
        name: 'community-by-tags',
        props: true,
        meta: { createPost: true, page: 'community-by-tags' },
        component: Community,
        children: [
          {
            path: 'post/:postId',
            name: 'community-by-tags-with-blog-post',
            props: true,
            meta: { createPost: true, page: 'community-by-tags' },
            component: Community
          }
        ]
      },
      {
        path: ':id/edit',
        name: 'edit-community',
        props: true,
        meta: { createPost: true, page: 'community' },
        component: Community
      }
    ]
  },
  /** @TODO revise name */
  {
    path: '/my-communities',
    name: 'my-communities',
    props: true,
    component: MyCommunities
  },
  {
    path: '/followers',
    name: 'followers',
    props: true,
    component: Followers,
    ...authenticatedRouteParams
  },
  {
    path: '/following',
    name: 'following',
    props: true,
    component: Following,
    ...authenticatedRouteParams
  },
  {
    path: '/blocking',
    name: 'blocking',
    props: true,
    component: Blocking,
    ...authenticatedRouteParams
  },
  {
    path: '/tag/:synonym?',
    name: 'tag-show',
    props: true,
    component: TagShow
  },
  {
    path: '/tag/:name/edit',
    name: 'tag-edit',
    props: true,
    component: TagEdit
  },
  {
    path: '/tag/:tagNames',
    props: true,
    component: Tagged,
    children: [
      {
        path: `blogPosts/${commonParams}`,
        name: 'tagged-blog-posts',
        props: true,
        meta: {
          main: 'tagged',
          createPost: true,
          page: 'tagged-blog-posts',
          tabIndex: 0
        },
        component: TaggedBlogPosts,
        children: [
          {
            path: 'post/:postId',
            name: 'tagged-blog-posts-with-blog-post',
            props: true,
            meta: {
              main: 'tagged',
              createPost: true,
              page: 'tagged-blog-posts',
              tabIndex: 0
            }
          }
        ]
      },
      {
        path: 'blogs/:pagination(\\d+)?',
        name: 'tagged-blogs',
        props: true,
        meta: { main: 'tagged', page: 'tagged-blogs', tabIndex: 1 },
        component: TaggedBlogs
      },
      {
        path: 'communities/:pagination(\\d+)?',
        name: 'tagged-communities',
        props: true,
        meta: { main: 'tagged', page: 'tagged-communities', tabIndex: 2 },
        component: TaggedCommunities
      }
    ]
  },
  {
    path: '/invites',
    name: 'invites',
    component: Invites,
    ...authenticatedRouteParams
  },
  {
    path: '/activities',
    name: 'activities',
    component: Activities,
    ...authenticatedRouteParams
  },
  {
    path: '/privacy-groups',
    name: 'privacy-groups',
    component: BlogPrivacyGroup
  },
  {
    path: '/settings',
    component: Settings,
    ...authenticatedRouteParams,
    children: [
      {
        path: 'user',
        name: 'settings-auth',
        meta: { tabIndex: 0 },
        component: AuthSettings
      },
      {
        path: 'blog',
        name: 'settings-blog',
        meta: { tabIndex: 1 },
        component: BlogSettings
      }
    ]
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;

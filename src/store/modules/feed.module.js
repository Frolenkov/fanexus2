import Vue from 'vue';
import { feedTypes, getNewsFeed } from '@/services/feed.service';
import {
  getBlogPost,
  deleteBlogPost,
  getBlogData
} from '@/services/Blog/blog.service';
import { getTaggedBlogPosts } from '@/services/tag.service';
import {
  getBlogPostLikes,
  getCommentLikes
} from '@/services/BlogPost/blogPost.service';
import { getComment } from '@/services/Comment/comment.service';
import { getCommunity } from '@/services/Community/community.service';
import { isIndexExists, getIndexById } from '@/utils/array.js';

const defaultPage = 1;

const state = {
  type: null,
  currentPage: defaultPage,
  data: { BlogPosts: [], id: 0, Tags: [], communityRules: [] }
};

const actions = {
  /** @TODO move to @see 'src\store\modules\blogPost.module.js' */
  async setFeedPage({ commit, dispatch }, { page, type }) {
    commit('setFeedPage', page);
    dispatch('getFeedData', { pagination: page, type });
  },
  async getFeedData({ commit }, { type, ...payload }) {
    let getData;
    try {
      switch (type) {
        case feedTypes.blog:
          getData = getBlogData;
          break;
        case feedTypes.community:
          getData = getCommunity;
          break;
        case feedTypes.tagged:
          getData = getTaggedBlogPosts;
          break;
        case feedTypes.likes:
          getData = getBlogPostLikes;
          break;
        case feedTypes.comments:
          getData = getCommentLikes;
          break;
        default:
          getData = getNewsFeed;
          break;
      }
      const data = await getData(payload);

      commit('setFeedType', type);
      commit('setFeedData', data);
    } catch (e) {
      if (e.response.status === 404) {
        throw e;
      } else {
        return false;
      }
    }
  },
  async deleteBlogPost({ commit, state }, { id, payload }) {
    const index = getIndexById(id, state.data.BlogPosts);

    if (isIndexExists(index)) {
      await deleteBlogPost(id, payload);
      commit('deleteBlogPost', index);
    }
  },
  async updateBlogPostData({ commit, state }, id) {
    if (!state.data.BlogPosts) return;

    const index = getIndexById(id, state.data.BlogPosts);

    if (isIndexExists(index)) {
      const payload = {
        ...(await getBlogPost(id)),
        ...(state.type === feedTypes.comments && {
          showComment: await getComment(
            state.data.BlogPosts[index].showComment.id
          )
        })
      };
      commit('updateBlogPostData', { index, payload });
    }
  }
};

const mutations = {
  setFeedPage(state, page) {
    state.currentPage = page || defaultPage;
  },
  setFeedData(state, payload) {
    state.data = payload;
  },
  setFeedType(state, type) {
    state.type = type || feedTypes.news;
  },
  updateBlogPostData(state, { index, payload }) {
    /** @TODO fix newsfeed it's 'blogPosts' there */
    Vue.set(state.data.BlogPosts, index, payload);
  },
  /** @TODO revise delete issue */
  deleteBlogPost(state, index) {
    Vue.delete(state.data.BlogPosts, index);
  }
};

export default {
  state,
  actions,
  mutations
};

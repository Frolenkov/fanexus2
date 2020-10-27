import { get, post, remove, patch } from '~api';
export const blogRoot = 'blog';
const sharingRoot = 'sharing';
const root = 'blogPost';

export const blogModalTypes = {
  createPrivacyGroup: 'createPrivacyGroup'
};

export const blogLikes = {
  postLike: 'like',
  postUnlike: 'unlike'
};

/** @TODO make it common between blog and community */
export const blogImageTypes = {
  coverImage: 'coverImage',
  avatar: 'avatar'
};

export const blogAreas = {
  allPosts: `${blogRoot}-all-posts`,
  settings: `${blogRoot}-settings`,
  followers: `${blogRoot}-followers`,
  following: `${blogRoot}-following`,
  likes: `${blogRoot}-likes`,
  privacyGroup: `${blogRoot}-privacy-group`
};

import {
  createFollow,
  deleteFollow,
  createBlock,
  deleteBlock
} from '@/services/follow.service';
export const groupComponentActions = {
  follow: {
    create: {
      label: 'Follow',
      action: createFollow
    },
    destroy: {
      label: 'Unfollow',
      action: deleteFollow
    }
  },
  block: {
    create: {
      label: 'Block',
      action: createBlock
    },
    destroy: {
      label: 'Unblock',
      action: deleteBlock
    }
  }
};

export const editBlog = (id, payload) => post(`${blogRoot}/${id}`, payload);
export const getBlogData = ({ name, pagination, tagNames, order }) =>
  get(
    `${blogRoot}/${encodeURIComponent(name)}${
      tagNames ? `/tags/${tagNames}` : ''
    }${order ? `/${order}` : ''}/${pagination}`
  );
export const getBlogFollowersCount = name =>
  get(`${blogRoot}/${name}/followedBy/count`);
export const getBlogLikesCount = name => get(`${blogRoot}/${name}/likes/count`);
export const getEligibleShareToEntitiesForAlias = payload =>
  post(`${root}/${sharingRoot}/getEligibleShareToEntitiesForAlias`, payload);
/** @TODO move all BlogPost related apis to a separate blogPost.service.js */
export const setBlogTags = (id, payload) =>
  patch(`${blogRoot}/${id}/tags`, payload);
export const addBlogTags = (id, payload) =>
  post(`${blogRoot}/${id}/tags/add`, payload);
export const removeBlogTags = (id, payload) =>
  post(`${blogRoot}/${id}/tags/remove`, payload);
export const getBlogPost = id => get(`${root}/${id}`);
export const createBlogPost = payload => post(root, payload);
export const editBlogPost = (id, payload) => post(`${root}/${id}`, payload);
export const deleteBlogPost = (id, payload) => remove(`${root}/${id}`, payload);
export const postLike = (id, payload) =>
  post(`${root}/${id}/${blogLikes.postLike}`, payload);
export const postUnlike = (id, payload) =>
  post(`${root}/${id}/${blogLikes.postUnlike}`, payload);

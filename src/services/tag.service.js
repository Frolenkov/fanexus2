import { get, put, patch } from '~api';
export const tagRoot = 'tag';

export const getTag = synonym => get(`${tagRoot}/${synonym}`);
export const createTag = (name, payload) => put(`${tagRoot}/${name}`, payload);
export const editTag = (name, payload) => patch(`${tagRoot}/${name}`, payload);

export const getTaggedBlogPosts = ({ tagNames, pagination, order }) =>
  get(
    `${tagRoot}/${tagNames}/blogPosts${order ? `/${order}` : ''}/${pagination}`
  );
export const getTaggedBlogs = tagNames => get(`${tagRoot}/${tagNames}/blogs`);
export const getTaggedCommunities = tagNames =>
  get(`${tagRoot}/${tagNames}/communities`);

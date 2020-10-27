import { get } from '~api';
const root = 'newsfeed';

export const feedTypes = {
  news: 'news',
  blog: 'blog',
  community: 'community',
  tagged: 'tagged',
  likes: 'likes',
  comments: 'comments'
};

export const getNewsFeed = ({ pagination = 1 }) => get(`${root}/${pagination}`);

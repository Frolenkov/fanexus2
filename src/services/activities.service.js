import { get } from '~api';
const root = 'notifications';

export const activityTypes = {
  follow: 'follow',
  reblog: 'reblog',
  comment: 'comment',
  like: 'like',
  invite: 'invite'
};

export const likeableTypes = {
  comment: 'comment',
  blogPost: 'blog post'
};

export const getActivities = () => get(`${root}`);
export const getNewActivitiesCount = () => get(`${root}/new/count`);
export const watchActivitiesCount = () => get(`${root}/new/count/watch`);
export const unwatchActivitiesCount = () => get(`${root}/new/count/unwatch`);

import { get } from '~api';
export const blogPostRoot = 'blogPost';
const blogRoot = 'blog';

export const blogPostEditorTitles = {
  newPost: 'New',
  editPost: 'Edit',
  share: 'Share'
};

export const blogPostOrders = [
  {
    value: undefined,
    label: 'Created'
  },
  {
    value: 'liked',
    label: 'Most likes'
  },
  {
    value: 'reblogged',
    label: 'Most reblogs'
  },
  {
    value: 'commented',
    label: 'Most comments'
  }
];

export const getBlogPostLikes = ({ name, pagination, tagNames, order }) =>
  get(
    `${blogRoot}/${name}/likes/blogPosts${tagNames ? `/tags/${tagNames}` : ''}${
      order ? `/${order}` : ''
    }/${pagination}`
  );
export const getCommentLikes = ({ name }) =>
  get(`${blogRoot}/${name}/likes/comments`);

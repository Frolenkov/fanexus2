import { communityAreas } from './community.service';

export default ({ blogPostCount }) => [
  {
    title: 'All Posts',
    component: communityAreas.posts,
    count: blogPostCount
  },
  {
    title: 'Members',
    component: communityAreas.members
  },
  {
    title: 'Rules',
    component: communityAreas.rules
  },
  {
    title: 'Moderators',
    component: communityAreas.moderators
  },
  {
    title: 'Requests',
    component: communityAreas.requests
  }
];

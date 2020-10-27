/** @TODO revise this component, then @see 'src\services\follow.service.js' and @see 'src\services\following.service.js' */
import { get } from '~api';

export const followersRoot = 'Followers';

/*@TODO revise*/
export const followersAreas = {
  FollowersFollowers: `${followersRoot}Followers`,
  FollowersRequests: `${followersRoot}Requests`
};

export const getFollowedBy = (id, followableType) =>
  get(`${followableType}/${id}/followedBy`);

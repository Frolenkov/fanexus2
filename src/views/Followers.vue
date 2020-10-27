<template>
  <div class="followers">
    <component :is="currentComponent" :data="data" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import getComponentsByPrefix from '@/utils/getComponentsByPrefix';
import {
  followersAreas,
  followersRoot,
  getFollowedBy
} from '@/services/followers.service';
import { followableTypes } from '@/services/following.service';
import tabsMixin from '@/mixins/tabs.mixin';
import AccountActionsHeader from '~common/AccountActionsHeader';
import FollowersFollowers from '@/components/Activities/FollowersFollowers';
import FollowersRequests from '@/components/Activities/FollowersRequests';

export default {
  components: {
    AccountActionsHeader,
    FollowersFollowers,
    FollowersRequests
  },
  mixins: [tabsMixin],
  data() {
    return {
      data: { followedBy: [] },
      currentPage: 1,
      currentComponent: followersAreas.FollowersFollowers,
      activeTab: 0,
      selectSecondaryOptions: [],
      navTabs: [
        {
          title: 'Followers',
          component: followersAreas.FollowersFollowers
        },
        {
          // @TODO make data dynamic
          title: 'Requests',
          number: '32',
          component: followersAreas.FollowersRequests
        }
      ],
      // @TODO make data dynamic
      selectPrimaryOptions: [
        { id: 15, text: 'security group name' },
        { id: 14, text: 'security group name' },
        { id: 13, text: 'security group name' },
        { id: 12, text: 'security group name' },
        { id: 11, text: 'security group name' }
      ]
    };
  },
  computed: {
    followersComponents() {
      return getComponentsByPrefix.call(this, followersRoot);
    },
    ...mapState({
      activeAliasBlogId: state => state.alias.activeAliasBlog.id
    })
  },
  methods: {
    setComponent(tabIndex = 0, componentIndex = 0) {
      this.handleSetActiveTab(tabIndex);
      this.currentComponent = this.followersComponents[componentIndex];
    },
    async getData() {
      this.data = await getFollowedBy(
        this.activeAliasBlogId,
        followableTypes.blog
      );
    }
  },
  watch: {
    activeAliasBlogId: {
      handler(val) {
        if (val) {
          this.getData();
        }
      },
      immediate: true
    }
  }
};
</script>
<style lang="scss" scoped>
.followers {
  overflow-y: auto;
  grid-area: content;
}
</style>

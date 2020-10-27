<template>
  <div class="following">
    <component
      :is="currentComponent"
      :data="data"
      button-type="follow"
      @remove-tag="unfollowTag"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import getComponentsByPrefix from '@/utils/getComponentsByPrefix';
import {
  followingAreas,
  followingRoot,
  getFollowing
} from '@/services/following.service';
import { deleteFollow } from '@/services/follow.service';
import { getTag } from '@/services/tag.service';
import tabsMixin from '@/mixins/tabs.mixin';
import AccountActionsHeader from '~common/AccountActionsHeader';
import FollowingFollowing from '@/components/Following/FollowingFollowing';

export default {
  components: {
    AccountActionsHeader,
    FollowingFollowing
  },
  mixins: [tabsMixin],
  data() {
    return {
      data: { followTag: [], followBlog: [], followCommunity: [] },
      currentPage: 1,
      currentComponent: followingAreas.FollowingFollowing,
      activeTab: 0,
      selectSecondaryOptions: [],
      navTabs: [
        {
          title: 'Following',
          component: followingAreas.FollowingFollowing
        }
      ],
      /** @TODO make data dynamic */
      selectPrimaryOptions: [
        { id: 15, text: 'Community name' },
        { id: 14, text: 'Community name' },
        { id: 13, text: 'Community name' },
        { id: 12, text: 'Community name' },
        { id: 11, text: 'Community name' }
      ]
    };
  },
  computed: {
    followingComponents() {
      return getComponentsByPrefix.call(this, followingRoot);
    },
    ...mapState({
      activeAliasBlogId: state => state.alias.activeAliasBlog.id,
      activeAliasId: state => state.alias.activeAliasId
    })
  },
  methods: {
    setComponent(tabIndex = 0, componentIndex = 0) {
      this.handleSetActiveTab(tabIndex);
      this.currentComponent = this.followingComponents[componentIndex];
    },
    async getData() {
      this.data = await getFollowing(this.activeAliasId);
    },
    async unfollowTag(tagName) {
      const tagId = (await getTag(tagName)).find(tag => tag.name === tagName)
        .id;
      await deleteFollow(tagId, 'tag');
      await this.getData();
      await this.getActiveAliasStats({
        alias: this.activeAliasId,
        blog: this.activeAliasBlogId
      });
    },
    ...mapActions(['getActiveAliasStats'])
  },
  watch: {
    activeAliasId: {
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
.following {
  grid-area: content;
  overflow-y: auto;
}
</style>

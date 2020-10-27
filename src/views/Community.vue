<template>
  <div v-if="data" class="community">
    <!-- @TODO revise it -->
    <wallpaper :src="data.coverImage ? data.coverImage.src : ''" />
    <div class="community-header">
      <div class="community-wrapper"></div>
      <tabs
        :tabs="navTabs"
        @selectTab="$active => setComponent($active, $active)"
        :active="activeTab"
        :additional-options="additionalOptions"
        @block="blockCommunity"
        @unblock="unblockCommunity"
      />
    </div>
    <div class="community__blocked-notice" v-if="data.aliasBlocking">
      You have blocked this community.
    </div>
    <div class="community__not-found-notice" v-else-if="notFound">
      Community not found.
    </div>
    <div class="community-content" v-else>
      <div class="community-wrapper">
        <sidebar-info
          v-if="data.name"
          :name="data.name"
          :feedType="feedTypes['community']"
          :description="data.description"
          :links="data.links"
          :tags="data.Tags"
          :isEditable="data.userHasEditPermissions"
          :isMember="data.aliasIsMember"
          :membershipPending="data.membershipPending"
          :isSubscribe="data.aliasFollowing"
          subtitle="Community links"
          @join="enterCommunity"
          @leave="leaveCommunity"
          @subscribe="subscribeToCommunity"
          @unsubscribe="unsubscribeFromCommunity"
          @edit="editCommunity"
        />
        <sidebar-select-order
          class="community__select-order"
          :selected="order"
        />
        <sidebar-tag-counts
          class="community__tag-counts"
          v-if="data.tagCounts && data.tagCounts.length"
          :tags="data.tagCounts"
          :current-tags="currentTags"
        />
      </div>
      <div v-if="data.BlogPosts" class="community-main">
        <component
          v-if="data && data.id"
          :current-page="currentPage"
          :is="currentComponent"
          :data="data"
          :rules="data.communityRules"
          :settings="settings"
          :communityId="data.id"
          :blogPosts="data.BlogPosts"
          :disabled="true"
          @onPageChange="onPageChange"
          @openModal="handleModalOpen"
        />
      </div>
    </div>
    <moderation-request-modal
      :settings="moderationModalSettings"
      :data="moderationModalData"
    />
    <members-modal
      v-if="modalSettings.show"
      :settings="modalSettings"
      :communityId="data.id"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex';
/** @TODO add to a corresponding mixin */
import { feedTypes } from '@/services/feed.service';
import getComponentsByPrefix from '@/utils/getComponentsByPrefix';
import {
  communityRoot,
  joinCommunity,
  removeMemberFromCommunity,
  setCommunityTags
} from '@/services/Community/community.service';
import {
  createFollow,
  deleteFollow,
  createBlock,
  deleteBlock,
  followableTypes
} from '@/services/follow.service';
import navTabs from '@/services/Community/community.navTabs';
import settings from '@/services/Community/community.settings';
import moderationModalData from '@/services/Community/community.moderationModalData';
import MembersModal from '@/components/Community/MembersModal';
import Avatar from '~common/Avatar';
import Tabs from '~common/Tabs';
import tabsMixin from '@/mixins/tabs.mixin';
import tagEditMixin from '@/mixins/tag-edit.mixin';
import contentSourceMixin from '@/mixins/content-source.mixin';
import SidebarInfo from '~common/SidebarInfo';
import SidebarTagCounts from '~common/SidebarTagCounts';
import SidebarSelectOrder from '~common/SidebarSelectOrder';
import Wallpaper from '~common/Wallpaper';
import BlogSettings from '@/components/Blog/BlogSettings';
import ModerationRequestModal from '@/components/Community/ModerationRequestModal';
import CommunityAllPosts from '@/components/Community/CommunityAllPosts';
import CommunityMembers from '@/components/Community/CommunityMembers';
import CommunityModerators from '@/components/Community/CommunityModerators';
import CommunityRules from '@/components/Community/CommunityRules';
import CommunityRequests from '@/components/Community/CommunityRequests';
import CommunityCreateRules from '@/components/Community/CommunityCreateRules';
import CommunitySettings from '../components/Community/CommunitySettings';

export default {
  props: {
    id: {
      required: true,
      type: [Number, String]
    },
    tagNames: {
      type: String
    },
    order: {
      type: String
    }
  },
  components: {
    ModerationRequestModal,
    Avatar,
    Tabs,
    SidebarTagCounts,
    SidebarSelectOrder,
    BlogSettings,
    SidebarInfo,
    Wallpaper,
    MembersModal,
    // communityAreas (the order should be strict)
    CommunityAllPosts,
    CommunityMembers,
    CommunityRules,
    CommunityModerators,
    CommunityRequests,
    CommunitySettings,
    CommunityCreateRules
  },
  mixins: [
    tabsMixin,
    tagEditMixin({ setTags: setCommunityTags }),
    contentSourceMixin
  ],
  data() {
    const context = this;
    return {
      currentPage: 1,
      activeTab: 0,
      currentComponent: null,
      settings,
      // @TODO we need to implement selectOptions in settings flow
      get navTabs() {
        return context.data && navTabs({ blogPostCount: context.data.count });
      },
      moderationModalSettings: {
        show: false,
        title: 'Moderation request',
        dismissText: 'Decline',
        actionText: 'Accept'
      },
      modalSettings: {
        show: false,
        title: 'Invite members to ',
        dismissText: 'Cancel',
        actionText: '+ Add',
        data: []
      },
      feedTypes,
      /** @TODO change to real data and remove 'src\services\Community\community.moderationModalData.js' */
      moderationModalData,
      notFound: false
    };
  },
  computed: {
    communityComponents() {
      return getComponentsByPrefix.call(this, communityRoot);
    },
    currentTags() {
      return this.tagNames && JSON.parse(this.tagNames);
    },
    additionalOptions() {
      return [
        {
          text: this.data.aliasBlocking ? 'Unblock' : 'Block',
          action: this.data.aliasBlocking ? 'unblock' : 'block',
          special: true,
          toggleable: false
        }
      ];
    }
  },
  methods: {
    ...mapActions(['getFeedData']),
    async getData() {
      try {
        await this.getFeedData({
          id: this.id,
          pagination: this.currentPage,
          type: feedTypes.community,
          tagNames: this.tagNames,
          order: this.order
        });
        this.modalSettings.title += this.data.name;
        this.notFound = false;
      } catch (e) {
        if (e.response.status === 404) {
          this.notFound = true;
        } else {
          throw e;
        }
      }
    },
    async onPageChange(page) {
      this.currentPage = page;
      await this.getData();
    },
    async enterCommunity() {
      const payload = {
        alias: this.activeAliasId
      };
      try {
        await joinCommunity(this.data.id, payload);
        await this.getData();
      } catch (e) {
        return false;
      }
    },
    // @TODO implement in future*/
    async leaveCommunity(aliasIdToRemove = this.activeAliasId) {
      const payload = {
        alias: this.activeAliasId,
        removeMemberId: aliasIdToRemove
      };
      try {
        await removeMemberFromCommunity(this.data.id, payload);
        await this.getData();
      } catch (e) {
        return false;
      }
    },
    async subscribeToCommunity() {
      try {
        await createFollow(this.data.id, followableTypes.community);
        await this.getData();
      } catch (e) {
        return false;
      }
    },
    async unsubscribeFromCommunity() {
      try {
        await deleteFollow(this.data.id, followableTypes.community);
        await this.getData();
      } catch (e) {
        return false;
      }
    },
    async blockCommunity() {
      try {
        await createBlock(this.data.id, followableTypes.community, {
          alias: this.activeAliasId
        });
        await this.getData();
      } catch (e) {
        return false;
      }
    },
    async unblockCommunity() {
      try {
        await deleteBlock(this.data.id, followableTypes.community, {
          alias: this.activeAliasId
        });
        await this.getData();
      } catch (e) {
        return false;
      }
    },
    async editCommunity() {
      await this.$router.push({
        name: 'edit-community',
        params: { id: this.data.link }
      });
    },
    handleModalOpen() {
      this.modalSettings.show = true;
    },
    setComponent(tabIndex = 0, componentIndex = 0) {
      this.handleSetActiveTab(tabIndex);
      this.currentComponent = this.communityComponents[componentIndex];
    }
  },
  async mounted() {
    await this.getData();
    this.setComponent();
  }
};
</script>

<style lang="scss" scoped>
.community {
  grid-area: content;
  overflow: auto;
  background-color: var(--BG-primary);

  ::v-deep &-tabs .nav-tabs li button {
    font-size: var(--size-button);
    text-transform: uppercase;
  }
  &-header {
    display: grid;
    align-items: end;
    grid-template-rows: minmax(0, 60px);
    grid-template-columns:
      var(--width-medium-small)
      max-content var(--width-small);
    grid-gap: var(--element-margin-xl);
    background-color: var(--BG-blog-post);
    padding: 0 var(--element-padding-xl);
    margin-bottom: var(--element-margin-xl);
  }
  &-content {
    padding: 0 var(--element-padding-xl);
    display: grid;
    grid-gap: var(--element-padding-xl);
    grid-template-columns: var(--width-medium-small) auto;
  }
  &__select-order,
  &__tag-counts {
    margin-top: var(--element-margin-s);
  }

  &__blocked-notice,
  &__not-found-notice {
    text-align: center;
    color: var(--text-primary);
  }
}
</style>

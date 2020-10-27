<template>
  <div v-if="data" class="blog">
    <wallpaper :src="data.coverImage ? data.coverImage.src : ''" />
    <div class="blog-header">
      <avatar
        class="blog-header__avatar"
        size="xl"
        :file="data.avatar ? data.avatar.src : ''"
      />
      <tabs
        :tabs="navTabs"
        @selectTab="$active => setComponent($active, $active)"
        :active="activeTab"
        :additional-options="additionalOptions"
        @block="blockBlog"
        @unblock="unblockBlog"
      />
    </div>
    <div class="blog__not-found-notice" v-if="notFound">
      Blog not found.
    </div>
    <div class="blog-content" v-else>
      <div class="blog-wrapper">
        <sidebar-info
          v-if="data.name"
          :name="data.name"
          :feedType="feedTypes['blog']"
          :description="data.description"
          :links="data.links"
          :tags="data.Tags"
          :isEditable="data.userHasEditPermissions"
          :isMember="data.aliasIsMember"
          :isSubscribe="data.aliasFollowing"
          @subscribe="subscribeToBlog"
          @unsubscribe="unsubscribeFromBlog"
          @edit="editBlog"
        />
        <sidebar-select-order class="blog__select-order" :selected="order" />
        <sidebar-tag-counts
          class="blog__tag-counts"
          v-if="data.tagCounts && data.tagCounts.length"
          :tags="data.tagCounts"
          :current-tags="currentTags"
        />
      </div>
      <div v-if="data.BlogPosts" class="blog-main">
        <keep-alive>
          <component
            :current-page="currentPage"
            @onPageChange="onPageChange"
            :blogPosts="data.BlogPosts"
            :data="data"
            :is="currentComponent"
            @openModal="handleModalOpen"
            :disabled="true"
          />
        </keep-alive>
      </div>
    </div>
    <!-- /*@TODO add close callback*/ -->
    <create-privacy-group-modal :settings="modalSettings[modalType]" />
  </div>
</template>

<script>
import { mapActions } from 'vuex';
/** @TODO add to a corresponding mixin */
import { feedTypes } from '@/services/feed.service';
import {
  createBlock,
  deleteBlock,
  createFollow,
  deleteFollow,
  followableTypes
} from '@/services/follow.service';
import getComponentsByPrefix from '@/utils/getComponentsByPrefix';
import {
  blogRoot,
  blogModalTypes,
  blogAreas,
  setBlogTags
} from '@/services/Blog/blog.service';
import settings from '@/services/Blog/blog.settings';
import Avatar from '~common/Avatar';
import Tabs from '~common/Tabs';
import tabsMixin from '@/mixins/tabs.mixin';
import contentSourceMixin from '@/mixins/content-source.mixin';
import tagEditMixin from '@/mixins/tag-edit.mixin';
import SidebarInfo from '~common/SidebarInfo';
import SidebarTagCounts from '~common/SidebarTagCounts';
import SidebarSelectOrder from '~common/SidebarSelectOrder';
import CreatePrivacyGroupModal from '@/components/Blog/CreatePrivacyGroupModal';
// blogAreas
import BlogAllPosts from '@/components/Blog/BlogAllPosts';
import SidebarForm from '~common/SidebarForm';
import Wallpaper from '~common/Wallpaper';

export default {
  props: {
    name: {
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
    CreatePrivacyGroupModal,
    Avatar,
    Tabs,
    SidebarInfo,
    SidebarTagCounts,
    SidebarSelectOrder,
    // blogAreas (the order should be strict)
    BlogAllPosts,
    Wallpaper,
    SidebarForm
  },
  mixins: [
    tabsMixin,
    tagEditMixin({ setTags: setBlogTags }),
    contentSourceMixin
  ],
  data() {
    const context = this;
    return {
      feedTypes,
      currentPage: 1,
      activeTab: 0,
      currentComponent: null,
      settings,
      /*@TODO revise*/
      navTabs: [
        {
          title: 'All Posts',
          component: blogAreas.allPosts,
          get count() {
            return context.data.count;
          }
        }
      ],
      blogModalTypes,
      modalType: blogModalTypes.createPrivacyGroup,
      modalSettings: {
        [blogModalTypes.createPrivacyGroup]: {
          show: false,
          title: 'Create new privacy group',
          dismissText: 'Cancel',
          actionText: 'Save'
        }
      },
      notFound: false
    };
  },
  computed: {
    /** @TODO make it common between blog and community */

    blogComponents() {
      return getComponentsByPrefix.call(this, blogRoot);
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
    ...mapActions(['getFeedData', 'setTagsList']),
    async getData() {
      try {
        await this.getFeedData({
          name: this.name,
          pagination: this.currentPage,
          type: feedTypes.blog,
          tagNames: this.tagNames,
          order: this.order
        });
        this.notFound = false;
      } catch (e) {
        if (e.response.status === 404) {
          this.notFound = true;
        } else {
          throw e;
        }
      }
    },
    handleModalOpen(modalType) {
      this.modalType = modalType;
      this.modalSettings[modalType].show = true;
    },
    async onPageChange(page) {
      this.currentPage = page;
      this.$router.push({
        params: {
          pagination: page
        }
      });
      await this.getData();
    },
    setComponent(tabIndex = 0, componentIndex = 0) {
      this.handleSetActiveTab(tabIndex);
      this.currentComponent = this.blogComponents[componentIndex];
    },
    async subscribeToBlog() {
      try {
        await createFollow(this.data.id, followableTypes.blog);
        await this.getData();
      } catch (e) {
        return false;
      }
    },
    async unsubscribeFromBlog() {
      try {
        await deleteFollow(this.data.id, followableTypes.blog);
        await this.getData();
      } catch (e) {
        return false;
      }
    },
    async blockBlog() {
      try {
        await createBlock(this.data.id, followableTypes.blog, {
          alias: this.activeAliasId
        });
        this.$router.push({ name: 'home' });
        // TODO: add `await this.getData();` when blocking blogs no longer makes them inaccessible from the back end. See: https://temperance-software.atlassian.net/browse/FAN-356
      } catch (e) {
        return false;
      }
    },
    async unblockBlog() {
      // Unused but may have future use, so keep it here.
      try {
        await deleteBlock(this.data.id, followableTypes.blog, {
          alias: this.activeAliasId
        });
        await this.getData();
      } catch (e) {
        return false;
      }
    },
    editBlog() {
      this.$router.push({
        name: 'edit-blog',
        params: { id: this.data.link || this.data.id }
      });
    }
  },
  async mounted() {
    await this.getData();
    this.setTagsList(this.data.Tags.map(({ name }) => name));
    this.setComponent();
  }
};
</script>
<style lang="scss" scoped>
.blog {
  grid-area: content;
  overflow: auto;
  background-color: var(--BG-primary);

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
    img {
      border: var(--border-width-avatar) solid var(--color-white);
    }
  }
  &-content {
    padding: 0 var(--element-padding-xl);
    display: grid;
    grid-column-gap: var(--element-margin-xl);
    grid-template-columns: var(--width-medium-small) auto;
  }
  &__select-order,
  &__tag-counts {
    margin-top: var(--element-margin-s);
  }

  &__not-found-notice {
    text-align: center;
    color: var(--text-primary);
  }
}
</style>

<template>
  <div class="edit-community" v-if="data">
    <modal
      class="edit-community-modal modal-overlay--centered"
      :settings="settings"
      @save="handleSave"
      :closeOnSave="false"
    >
      <template slot="body">
        <add-image
          :type="blogImageTypes.coverImage"
          class="edit-community__add-bg"
          button-text="Add Background"
          @add="handleAddImage"
        >
          <wallpaper :src="coverImageData" />
        </add-image>
        <tabs
          :tabs="navTabs"
          @selectTab="$active => setComponent($active, $active)"
          :active="activeTab"
        />
        <component
          :is="currentComponent"
          v-model="data"
          :errors="errors"
          @clear-error="clearError"
        />
      </template>
    </modal>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { feedTypes } from '@/services/feed.service';
import getComponentsByPrefix from '@/utils/getComponentsByPrefix';
import Wallpaper from '~common/Wallpaper';
import Modal from '~common/Modal';
import AddImage from '../common/AddImage';
import Tabs from '~common/Tabs';
import tabsMixin from '@/mixins/tabs.mixin';
import validationMixin from '@/mixins/validation.mixin';
import {
  getCommunity,
  editCommunity,
  blogImageTypes,
  communityRoot,
  communityEditAreas
} from '@/services/Community/community.service';
import CommunityProfile from '@/components/Community/CommunityProfile';
import CommunitySettings from '@/components/Community/CommunitySettings';

export default {
  components: {
    AddImage,
    Wallpaper,
    Modal,
    Tabs,
    CommunityProfile,
    CommunitySettings
  },
  props: {
    id: {
      type: String,
      required: true
    },
    settings: {
      type: Object,
      required: true
    }
  },
  mixins: [tabsMixin, validationMixin],
  data() {
    return {
      blogImageTypes,
      activeTab: 0,
      currentComponent: 'community-profile',
      navTabs: [
        {
          title: 'Profile',
          component: communityEditAreas.profile
        },
        {
          title: 'Settings',
          component: communityEditAreas.settings
        }
      ],
      data: null,
      errors: []
    };
  },
  computed: {
    coverImageData() {
      if (!this.data || !this.data.coverImage) return '';

      return this.data.coverImage.accessUrl || this.data.coverImage.src;
    },
    communityEditComponents() {
      return getComponentsByPrefix.call(this, communityRoot);
    },
    ...mapState({
      activeAliasId: state => state.alias.activeAliasId
    })
  },
  methods: {
    setComponent(tabIndex = 0, componentIndex = 0) {
      this.handleSetActiveTab(tabIndex);
      this.currentComponent = ['community-profile', 'community-settings'][
        componentIndex
      ];
    },
    handleAddImage({ type, data }) {
      this.data[type] = data;
    },

    async handleSave() {
      /** @TODO revise */
      const {
        name,
        link,
        links,
        description,
        coverImage,
        contentAccessControl,
        followsAccessControl,
        commentsAccessControl,
        postingAccessControl,
        membersAccessControl,
        reactionsAccessControl
      } = this.data;
      const payload = {
        alias: this.activeAliasId,
        contentAccessControl,
        followsAccessControl,
        postingAccessControl,
        commentsAccessControl,
        membersAccessControl,
        reactionsAccessControl,
        name,
        link,
        links,
        description,
        rules: this.data.communityRules.map(({ name, description }) => ({
          name,
          description
        })),
        tagNames: this.data.Tags.map(({ name }) => name)
      };
      /** @TODO make it common between blog and community */
      payload.rules = payload.rules.filter(
        rules => rules.name.length || rules.description.length
      );
      payload.links = payload.links.filter(link => link.length);

      /** @TODO make it common between blog and community */
      if (coverImage && coverImage.accessUrl) {
        payload.coverImage = coverImage;
      }

      try {
        await editCommunity(this.data.id, payload);
        this.getFeedData({
          id: link || this.data.id,
          pagination: 1,
          type: feedTypes.community
        });
        this.$router.push({
          name: 'community',
          params: {
            id: link
          }
        });
      } catch (e) {
        this.errors = e.response.data.errors;
      }
    },
    ...mapActions(['getFeedData'])
  },
  async mounted() {
    this.data = (result => ({
      ...result,
      rules: result.communityRules.map(({ name, description }) => ({
        name,
        description
      }))
    }))(
      await getCommunity({
        id: this.id,
        pagination: 1
      })
    );
  }
};
</script>

<style lang="scss" scoped>
.edit-community {
  grid-area: content;
  overflow: auto;
  background-color: var(--BG-primary);
  &__add-bg {
    ::v-deep .button {
      padding: 8px var(--element-padding-xxl);
    }
  }
}
</style>

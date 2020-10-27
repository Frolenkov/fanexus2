<template>
  <section class="moderators">
    <tab-content-grid
      :showSearch="true"
      title="Moderators"
      @handle-input="handleInput"
    >
      <group-component
        group-component-type="blog"
        :link="link"
        v-for="({ id, name, avatar, updatedAt, Blog: { link } },
        index) in groups"
        :key="`${id}-${index}`"
        @delete="showModal(id)"
        activityName="Updated at"
        :date="updatedAt"
        :name="name"
        :options="dropdownOptionsModerators"
        :userHasEditPermissions="data && data.userHasEditPermissions"
        :image="avatar ? avatar.src : ''"
      />
      <confirmation-modal
        @submit="deleteModerator"
        v-if="settings.show"
        :settings="settings"
      />
    </tab-content-grid>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import {
  communityAreas,
  getModerators,
  removeModerators
} from '@/services/Community/community.service';
import GroupComponent from '@/components/Blog/GroupComponent';
import TabContentGrid from '../common/TabContentGrid';
import ConfirmationModal from '../common/ConfirmationModal';
import { deleteItemById } from '@/utils/array';

export default {
  name: communityAreas.moderators,
  components: {
    GroupComponent,
    TabContentGrid,
    ConfirmationModal
  },
  props: {
    communityId: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      data: null,
      groups: [],
      activeItem: null,
      settings: {
        show: false,
        title: 'Delete moderator',
        /** @TODO make 'Cancel' a default dismissText  */
        removedItem: 'user',
        removedFrom: 'moderators',
        dismissText: 'Cancel',
        actionText: 'Delete',
        data: []
      },
      dropdownOptionsModerators: [
        {
          text: 'Delete moderator',
          action: 'delete',
          special: true,
          togglable: false
        }
      ]
    };
  },
  methods: {
    handleModalOpen(modalType) {
      this.$emit('openModal', { type: modalType });
    },
    showModal(id) {
      this.activeItem = id;
      this.settings.show = true;
    },
    removeItemFromArray() {
      deleteItemById(this.activeItem, this.groups, () => {
        this.activeItem = null;
      });
    },
    async deleteModerator() {
      const payload = {
        alias: this.activeAliasId,
        moderators: [this.activeItem]
      };
      try {
        await removeModerators(this.communityId, payload);
        this.removeItemFromArray();
      } catch (e) {
        return false;
      }
    },
    async getData(filterBy) {
      this.groups = await getModerators(this.communityId, 1, filterBy);
    },
    async handleInput(input) {
      await this.getData(input);
    }
  },
  computed: {
    ...mapState({
      activeAliasId: state => state.alias.activeAliasId
    })
  },
  async mounted() {
    await this.getData();
  }
};
</script>
<style lang="scss" scoped>
::v-deep .group-title {
  &__text {
    font-size: var(--size-button);
  }
}
</style>

<template>
  <div class="my-communities">
    <account-actions-header
      :selectSecondaryOptions="selectSecondaryOptions"
      :navTabs="navTabs"
    />
    <div class="my-communities__container">
      <router-link
        :to="{ name: 'create-community' }"
        class="my-communities__link"
        ><add-button text="Create new community" class="my-communities__add-btn"
      /></router-link>
      <my-community-card
        :src="(group.coverImage && group.coverImage.src) || undefined"
        :membersCount="group.membersCount"
        :communityName="group.name"
        v-for="(group, index) in groups"
        :key="`${group.title}-${index}`"
        :data="group"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import AccountActionsHeader from '~common/AccountActionsHeader';
import MyCommunityCard from '@/components/Activities/MyCommunityCard';
import AddButton from '~common/Buttons/AddButton';
import { myCommunities } from '../services/Community/community.service';

export default {
  components: {
    AccountActionsHeader,
    MyCommunityCard,
    AddButton
  },
  data() {
    return {
      activeTab: 0,
      selectSecondaryOptions: [],
      navTabs: [
        {
          title: 'My communities'
        }
      ],
      groups: null,
      // @TODO make data dynamic
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
    ...mapState({
      activeAliasId: state => state.alias.activeAliasId
    })
  },
  methods: {
    async getData() {
      this.groups = await myCommunities();
    }
  },
  watch: {
    activeAliasId: {
      handler(val) {
        if (val) {
          return this.getData();
        }
      },
      immediate: true
    }
  }
};
</script>
<style lang="scss" scoped>
.my-communities {
  overflow-y: auto;
  grid-area: content;
  &__container {
    padding: var(--element-padding-xl);
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: var(--element-margin-m);
  }
  &__link {
    text-decoration: none;
    height: 150px;
  }
  &__add-btn {
    width: 100%;
    height: 100%;
  }
}
</style>

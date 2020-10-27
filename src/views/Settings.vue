<template>
  <div class="settings">
    <flash-message :message="successMessage" v-if="success" />
    <tabs :tabs="navTabs" @selectTab="navigateToTab" :active="tabIndex" />
    <router-view
      :key="`${activeAliasId}-${tabIndex}`"
      @success="showSuccess"
      :disabled="success"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Tabs from '~common/Tabs';
import FlashMessage from '~common/FlashMessage';

export default {
  components: {
    Tabs,
    FlashMessage
  },
  data() {
    return {
      navTabs: [
        {
          title: 'User settings'
        },
        {
          title: 'Blog settings'
        }
      ],
      success: false,
      successMessage: 'Successfully saved.',
      successRemoveTime: 10000,
      successRemove: null
    };
  },
  computed: {
    ...mapState({
      activeAliasId: state => state.alias.activeAliasId
    }),
    tabIndex() {
      return this.$route.meta.tabIndex;
    },
    formData() {
      return {
        password: this.currentPassword,
        email: this.email,
        newPassword: this.newPassword,
        newPasswordAgain: this.confirmNewPassword
      };
    }
  },
  methods: {
    navigateToTab(tabIndex) {
      this.$router.push({
        name: ['settings-auth', 'settings-blog'][tabIndex]
      });
    },
    showSuccess() {
      clearTimeout(this.successRemove);
      this.success = true;
      this.successRemove = setTimeout(
        () => (this.success = false),
        this.successRemoveTime
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.settings {
  grid-area: content;
  overflow: auto;
  background-color: var(--BG-primary);
  padding: var(--element-padding-m);
}
</style>

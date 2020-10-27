<template>
  <div class="likes">
    <tabs :tabs="navTabs" @selectTab="navigateToTab" :active="tabIndex" />
    <router-view :key="`${activeAliasId}-${tabIndex}`" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Tabs from '~common/Tabs';
import tabsMixin from '@/mixins/tabs.mixin';

export default {
  components: {
    Tabs
  },
  computed: {
    ...mapState({
      data: state => state.feed.data,
      activeAliasId: state => state.alias.activeAliasId
    }),
    tabIndex() {
      return this.$route.meta.tabIndex;
    }
  },
  mixins: [tabsMixin],
  data() {
    return {
      loaded: false,
      navTabs: [
        {
          title: 'Blog posts'
        },
        {
          title: 'Comments'
        }
      ]
    };
  },
  methods: {
    navigateToTab(tabIndex) {
      this.$router.push({
        name: ['blog-likes', 'blog-likes-comments'][tabIndex],
        params: this.$route.params
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.likes {
  grid-area: content;
  overflow: auto;
  padding: var(--element-padding-l);
}
</style>

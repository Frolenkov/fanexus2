<template>
  <div class="tagged-blog-posts">
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
  mixins: [tabsMixin],
  data() {
    return {
      activeTab: 0,
      navTabs: [
        {
          title: 'Blog posts'
        },
        {
          title: 'Blogs'
        },
        {
          title: 'Communiites'
        }
      ]
    };
  },
  methods: {
    navigateToTab(tabIndex) {
      this.$router.push({
        name: ['tagged-blog-posts', 'tagged-blogs', 'tagged-communities'][
          tabIndex
        ],
        params: this.$route.params
      });
    }
  },
  computed: {
    ...mapState({
      activeAliasId: state => state.alias.activeAliasId
    }),
    tabIndex() {
      return this.$route.meta.tabIndex;
    }
  }
};
</script>
<style lang="scss" scoped>
.tagged-blog-posts {
  grid-area: content;
  overflow: auto;
  background-color: var(--BG-primary);
  padding: var(--element-padding-xl);
}
</style>

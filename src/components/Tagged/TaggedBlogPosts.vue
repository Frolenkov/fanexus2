<template>
  <div class="tagged-blog-posts">
    <div class="tagged-blog-posts__sidebar">
      <sidebar-select-order
        class="tagged-blog-posts__select-order"
        :selected="order"
      />
      <sidebar-tag-counts
        class="tagged-blog-posts__tag-counts"
        v-if="data.tagCounts && data.tagCounts.length"
        :tags="data.tagCounts"
        :current-tags="currentTags"
      />
    </div>
    <blog-all-posts
      v-if="loaded"
      :blogPosts="data.BlogPosts"
      :current-page="currentPage"
      @onPageChange="onPageChange"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { feedTypes } from '@/services/feed.service';
import BlogAllPosts from '@/components/Blog/BlogAllPosts';
import SidebarTagCounts from '~common/SidebarTagCounts';
import SidebarSelectOrder from '~common/SidebarSelectOrder';

export default {
  props: {
    tagNames: {
      required: true,
      type: String
    },
    order: {
      type: String
    }
  },
  components: {
    BlogAllPosts,
    SidebarTagCounts,
    SidebarSelectOrder
  },
  computed: {
    ...mapState({
      data: state => state.feed.data
    }),
    currentTags() {
      return JSON.parse(this.tagNames);
    }
  },
  data() {
    return {
      currentPage: 1,
      loaded: false
    };
  },
  methods: {
    ...mapActions(['getFeedData']),
    async getData() {
      return this.getFeedData({
        tagNames: this.tagNames,
        pagination: this.currentPage,
        type: feedTypes.tagged,
        order: this.order
      });
    },
    onPageChange(page) {
      this.currentPage = page;
      this.$router.push({
        params: {
          pagination: page
        }
      });
      return this.getData();
    }
  },
  async mounted() {
    await this.getData();
    this.loaded = true;
  }
};
</script>
<style lang="scss" scoped>
.tagged-blog-posts {
  padding: var(--element-padding-xl);
  display: grid;
  grid-gap: var(--element-margin-m);
  grid-template-columns: var(--width-small) auto;

  &__tag-counts {
    margin-top: var(--element-margin-s);
  }
}
</style>

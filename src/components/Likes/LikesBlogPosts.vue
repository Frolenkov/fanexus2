<template>
  <section class="likes-blog-posts">
    <!-- @TODO will be revised in https://temperance-software.atlassian.net/browse/FAN-210 -->
    <div class="likes-blog-posts__sidebar">
      <sidebar-select-order
        class="likes-blog-posts__select-order"
        :selected="order"
      />
      <sidebar-tag-counts
        class="likes-blog-posts__tag-counts"
        v-if="data.tagCounts && data.tagCounts.length"
        :tags="data.tagCounts"
        :current-tags="currentTags"
      />
    </div>
    <blog-all-posts
      :blog-posts="data.BlogPosts"
      v-if="loaded"
      :current-page="currentPage"
      @onPageChange="onPageChange"
    />
  </section>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { feedTypes } from '@/services/feed.service';
import BlogAllPosts from '@/components/Blog/BlogAllPosts';
import SidebarTagCounts from '~common/SidebarTagCounts';
import SidebarSelectOrder from '~common/SidebarSelectOrder';

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
    BlogAllPosts,
    SidebarTagCounts,
    SidebarSelectOrder
  },
  computed: {
    ...mapState({
      data: state => state.feed.data
    }),
    currentTags() {
      return this.tagNames && JSON.parse(this.tagNames);
    }
  },
  data() {
    return {
      loaded: false,
      currentPage: 1
    };
  },
  methods: {
    ...mapActions(['getFeedData']),
    getData() {
      return this.getFeedData({
        name: this.name,
        pagination: this.currentPage,
        type: feedTypes.likes,
        tagNames: this.tagNames,
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
.likes-blog-posts {
  padding: var(--element-padding-xl);
  display: grid;
  grid-gap: var(--element-margin-m);
  grid-template-columns: var(--width-small) auto;

  &__tag-counts {
    margin-top: var(--element-margin-s);
  }
}
</style>

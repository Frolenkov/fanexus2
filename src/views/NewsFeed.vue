<template>
  <div class="feed pinterest">
    <div v-if="data" class="feed-news ">
      <template v-if="data.BlogPosts">
        <!-- use @openModal="openBlogModal" from vuex -->
        <blog-post
          v-for="blogPost in data.BlogPosts"
          :key="blogPost.id"
          :data="blogPost"
          :showComments="false"
          :expandable="true"
        />
      </template>
    </div>
    <div class="feed-popular-blogs">
      <popular-communities v-if="data && data.suggestions" :data="data" />
    </div>
    <footer>
      <pagination :current-page="feedPage" @pageChanged="getData" />
    </footer>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import BlogPost from '@/components/Blog/BlogPost';
import Pagination from '../components/common/Pagination';
import PopularCommunities from '~common/PopularCommunities';

export default {
  components: {
    PopularCommunities,
    BlogPost,
    Pagination
  },
  computed: {
    ...mapState({
      data: state => state.feed.data,
      feedPage: state => state.feed.currentPage,
      activeAliasId: state => state.alias.activeAliasId
    })
  },
  methods: {
    ...mapActions(['getFeedData', 'setFeedPage']),
    async getData(pagination) {
      this.setFeedPage({ page: pagination });
    }
  },
  watch: {
    activeAliasId(val) {
      if (val) {
        return this.getData();
      }
    }
  },
  async mounted() {
    this.getData();
  }
};
</script>
<style lang="scss" scoped>
.feed {
  overflow-y: auto;
  grid-area: content;
  padding: var(--element-padding-xl);
  display: grid;
  grid-template-columns: 65% 15%;
  grid-column-gap: var(--element-padding-xl);

  &.pinterest {
    grid-template-columns: 85% 15%;
    padding: var(--element-padding-l);
    grid-column-gap: var(--element-padding-m);
  }

  &-news {
    display: grid;
    grid-template-columns: repeat(4, minmax(100px, 1fr));
    grid-gap: var(--element-margin-m);
    /** @TODO take it from the variable @see https://temperance-software.atlassian.net/browse/FAN-219 */
    grid-auto-rows: 20px;
  }
}
</style>

<template>
  <section class="all-posts">
    <div class="all-posts-items">
      <blog-post
        :key="blog.id"
        :data="blog"
        :showComments="false"
        :expandable="true"
        v-for="blog in blogPosts"
      />
    </div>
    <pagination
      :current-page="currentPage"
      @pageChanged="$emit('onPageChange', $event)"
    /></section
></template>

<script>
import BlogPost from '@/components/Blog/BlogPost';
import { communityAreas } from '@/services/Community/community.service';
import Pagination from '../common/Pagination';
export default {
  name: communityAreas.posts,
  components: {
    BlogPost,
    Pagination
  },
  props: {
    blogPosts: {
      type: Array,
      required: true
    },
    currentPage: {
      type: Number,
      default: 1
    },
    communityId: {
      type: [Number, String],
      required: true
    }
  }
};
</script>

<style scoped lang="scss">
.all-posts {
  &-items {
    display: grid;
    grid-template-columns: repeat(4, minmax(100px, 1fr));
    grid-gap: var(--element-margin-m);
  }
}
</style>

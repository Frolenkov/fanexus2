<template>
  <section class="all-posts">
    <div class="all-posts-items">
      <blog-post
        v-for="(blog, index) in blogPosts"
        :key="`${blog.id}-${index}`"
        :data="blog"
        :showComments="false"
        :expandable="true"
      />
    </div>
    <pagination
      :current-page="currentPage"
      @pageChanged="$emit('onPageChange', $event)"
    />
  </section>
</template>
<script>
import BlogPost from '@/components/Blog/BlogPost';
import { blogAreas } from '@/services/Blog/blog.service';
import Pagination from '../common/Pagination';
export default {
  name: blogAreas.allPosts,
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
    }
  }
};
</script>
<style lang="scss" scoped>
.all-posts {
  &-items {
    display: grid;
    grid-template-columns: repeat(4, minmax(100px, 1fr));
    grid-gap: var(--element-margin-m);
    grid-auto-rows: 20px;
  }
}
</style>

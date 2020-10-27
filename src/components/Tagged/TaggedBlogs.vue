<template>
  <div class="tagged-blogs">
    <!-- @TODO make image src dynamically: https://temperance-software.atlassian.net/browse/FAN-186 -->
    <blog-card
      :src="(blog.avatar && blog.avatar.src) || undefined"
      :blog-name="blog.name"
      v-for="(blog, index) in blogs"
      :key="`${blog.link}-${index}`"
      :data="blog"
    />
  </div>
</template>

<script>
import { getTaggedBlogs } from '@/services/tag.service';
import BlogCard from '@/components/Activities/BlogCard';

export default {
  props: {
    tagNames: {
      required: true,
      type: String
    }
  },
  components: {
    BlogCard
  },
  data() {
    return {
      blogs: []
    };
  },
  methods: {
    async getData() {
      this.blogs = await getTaggedBlogs(this.tagNames);
    }
  },
  async mounted() {
    await this.getData();
  }
};
</script>
<style lang="scss" scoped>
.tagged-blogs {
  padding: var(--element-padding-xl);
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: var(--element-margin-m);
}
</style>

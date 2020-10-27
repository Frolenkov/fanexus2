<template>
  <span>
    has reblogged your
    <router-link
      :to="{
        name: 'blog-with-blog-post',
        params: { name: activeAliasBlogId, postId: data.targetBlogPostId }
      }"
      >blog post</router-link
    >
    "<span v-html="previewContent" />".
  </span>
</template>

<script>
import { mapState } from 'vuex';
import previewMixin from '@/mixins/preview.mixin';

export default {
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  mixins: [previewMixin],
  computed: {
    ...mapState({
      activeAliasBlogId: state => state.alias.activeAliasBlog.id
    }),
    previewContent() {
      return this.data.targetBlogPost
        ? this.preview(this.data.targetBlogPost.content)
        : '(deleted blog post)';
    }
  }
};
</script>

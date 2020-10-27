<template>
  <span>
    has commented
    {{ data.sourceComment && preview(data.sourceComment.content) }} on your
    <component
      :is="this.data.targetBlogPost ? 'router-link' : 'span'"
      :to="{
        name: `${blogPostIn}-with-blog-post`,
        params: {
          [blogPostLocationParameterName]: blogPostLocation,
          postId: data.targetBlogPostId
        }
      }"
      >{{ targetType }}</component
    >
    "<span v-html="previewContent" />".
  </span>
</template>

<script>
import { mapState } from 'vuex';
import { commentableTypes } from '@/services/Comment/comment.service';
import previewMixin from '@/mixins/preview.mixin';
import targetBlogPostMixin from '@/mixins/target-blog-post.mixin';

export default {
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  mixins: [previewMixin, targetBlogPostMixin],
  computed: {
    ...mapState({
      activeAliasBlogId: state => state.alias.activeAliasBlog.id
    }),
    targetType() {
      return this.data.targetBlogPostId
        ? commentableTypes.blogPost
        : commentableTypes.comment;
    },
    previewContent() {
      return this.data.targetBlogPostId
        ? this.data.targetBlogPost
          ? this.preview(this.data.targetBlogPost.content)
          : '(deleted blog post)'
        : this.data.targetComment
        ? this.preview(this.data.targetComment.content)
        : '(deleted comment)';
    }
  }
};
</script>

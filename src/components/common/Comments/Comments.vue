<template>
  <div class="comments">
    <new-comment-form
      :newComment="newComment"
      @input="$emit('newCommentInput', $event)"
      @createComment="$emit('createComment')"
    />
    <div v-if="comments && comments.length" class="comments-list">
      <comment
        :key="index"
        v-for="(comment, index) in comments"
        :comment="comment"
        :blogPostId="blogPostId"
        :isExtraDepth="!!comment.parentCommentId"
        @delete="$id => $emit('delete', $id)"
        @refresh="$emit('refresh')"
        @goToThread="$thread => $emit('goToThread', $thread)"
        @refreshData="$emit('refreshData')"
      />
    </div>
  </div>
</template>
<script>
import NewCommentForm from '@/components/common/Comments/NewCommentForm';
import Comment from '@/components/common/Comments/Comment';

export default {
  components: {
    NewCommentForm,
    Comment
  },
  props: {
    blogPostId: {
      type: undefined
    },
    newComment: {
      type: String
    },
    comments: {
      /** @TODO add default value */
      type: Array
    }
  }
};
</script>
<style lang="scss" scoped>
.comments {
  padding-bottom: var(--element-padding-s);
  &-list {
    margin: 0 var(--element-margin-l);
    ::v-deep .child {
      margin: 0;
    }
  }
}
</style>

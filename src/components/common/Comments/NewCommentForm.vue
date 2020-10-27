<template>
  <form class="comments-new">
    <avatar
      :file="getActiveAliasAvatarSrc"
      class="comments-new__avatar"
      size="md"
      @click.native.prevent="goToOrigin"
    />
    <div class="comments-new-textarea">
      <comment-input
        :newComment="newComment"
        class="comments-new-textarea__input"
        placeholder="Type your comment here"
        @createComment="$emit('createComment')"
        @input="comment => $emit('input', comment)"
      />
    </div>
  </form>
</template>
<script>
import { mapState, mapGetters } from 'vuex';
import { routerSecureNavigation } from '@/services/router.service';
import CommentInput from '@/components/common/Comments/CommentInput';
import Avatar from '~common/Avatar';

export default {
  components: {
    CommentInput,
    Avatar
  },
  props: {
    newComment: {
      type: String
    }
  },
  computed: {
    ...mapState({
      activeAliasBlogId: state => state.alias.activeAliasBlog.id,
      activeAliasBlogLink: state => state.alias.activeAliasBlog.link
    }),
    ...mapGetters(['getActiveAliasAvatarSrc']),
    originLink() {
      return this.activeAliasBlogLink || this.activeAliasBlogId;
    }
  },
  methods: {
    goToOrigin() {
      routerSecureNavigation({
        /** we should just ignore cases where there's no origin or Blog field in the data */
        name: 'blog',
        params: { name: this.originLink }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.comments-new {
  display: flex;
  align-items: stretch;
  margin: var(--element-margin-s) var(--element-margin-l);

  &-textarea {
    flex: 1;
  }

  &.child {
    margin: var(--element-margin-s) 0;
  }
  &__avatar {
    cursor: pointer;
    margin-right: var(--element-margin-m);
  }
}
</style>

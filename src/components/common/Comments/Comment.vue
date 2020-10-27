<template>
  <article class="comments-list-item">
    <div
      :class="{ active: isShowAllCommentsComputed || isExtraDepth }"
      class="comments-list-item__buttons"
    >
      <button
        v-if="isShowAllCommentsComputed"
        class="comments-list-item__button-thread"
        @click="handleViewAllComments"
      >
        View all comments
      </button>
      <button
        v-if="isExtraDepth"
        class="comments-list-item__button-thread"
        @click="() => goToThread(comment.parentCommentId)"
      >
        Show parent comments
      </button>
    </div>

    <div class="comments-list-item__wrapper">
      <avatar
        class="comments-list-item__avatar"
        size="md"
        :file="comment.Alias.avatar.src"
        @click.native.prevent="goToOrigin"
      />
      <div class="comments-list-item__content">
        <div class="comments-list-item-title">
          <h2 class="comments-list-item-title__name">
            {{ comment.Alias.name }}
          </h2>
          <p
            class="comments-list-item-title__date"
            :class="{ 'comments-list-item-title__date-standalone': standalone }"
            @click.stop="openBlogPostModal"
          >
            {{ comment.updatedAt | dateFormat }}
          </p>
        </div>
        <comment-input
          :new-comment="comment.content"
          v-if="editing"
          :editing="true"
          @input="comment => (editedComment = comment)"
          @createComment="handleUpdateComment(comment.id)"
        />
        <div class="comments-list-item__text" v-html="comment.content" v-else />
        <action-buttons-group
          class="comment"
          :engagementStats="comment.engagementStats"
          :commentsLength="commentsLength"
          :showNewCommentForm="showNewCommentForm"
          :showChildComments="showChildComments"
          :userHasEditPermissions="comment.userHasEditPermissions"
          @toggleCommentForm="showNewCommentForm = !showNewCommentForm"
          @toggleChildComments="showChildComments = !showChildComments"
          @likeClicked="commentLikeToggle"
          @delete="() => handleDeleteComment(comment.id)"
          @edit="handleEditComment"
          :userLiked="comment.userLiked"
          :options="dropdownOptionsComment"
        />
        <button
          v-if="comment.hasChildComments"
          class="comments-list-item__button-thread"
          @click="() => goToThread()"
        >
          Continue this thread
          <i class="comments-list-item__button-thread-right-arrow" />
        </button>
      </div>
    </div>

    <new-comment-form
      v-if="showNewCommentForm"
      class="child"
      @input="comment => (newComment = comment)"
      @createComment="() => handleCreateComment(comment.id)"
    />
    <div
      v-if="commentsLength && showChildComments"
      class="child-comment__wrapper"
    >
      <comment
        v-for="(childComment, index) in comment.childComments"
        :key="`${childComment.id}-${index}`"
        :comment="childComment"
        :blogPostId="blogPostId"
        @input="comment => (newComment = comment)"
        @refresh="refresh"
        @delete="() => handleDeleteComment(childComment.id)"
        @createComment="() => handleCreateComment(childComment.parentCommentId)"
        @goToThread="$thread => $emit('goToThread', $thread)"
      />
    </div>
  </article>
</template>
<script>
import { mapState } from 'vuex';
import { deleteItemById } from '@/utils/array';
import { routerSecureNavigation } from '@/services/router.service';
import {
  getComment,
  createComment,
  commentDelete,
  updateComment,
  commentLike,
  commentUnlike
} from '@/services/Comment/comment.service';
import dropdownOptionsComment from '@/services/Comment/comment.dropdownOptions';
import ActionButtonsGroup from '~common/ActionButtonsGroup';
import Avatar from '~common/Avatar';
import NewCommentForm from '@/components/common/Comments/NewCommentForm';
import Comment from '@/components/common/Comments/Comment';
import CommentInput from '@/components/common/Comments/CommentInput';

export default {
  name: 'comment',
  props: {
    blogPostId: {
      type: undefined
    },
    comment: {
      type: Object
    },
    standalone: {
      type: Boolean,
      default: false
    },
    isExtraDepth: {
      type: Boolean,
      default: false
    }
  },
  components: {
    ActionButtonsGroup,
    Avatar,
    NewCommentForm,
    Comment,
    CommentInput
  },
  computed: {
    ...mapState({
      activeAliasId: state => state.alias.activeAliasId
    }),
    isShowAllCommentsComputed() {
      return (
        this.isExtraDepth ||
        this.isShowAllComments ||
        this.comment.lastCommentThread
      );
    },
    originLink() {
      const {
        Blog: { link, id }
      } = this.comment.Alias;

      return link || id;
    },
    commentsLength() {
      const comments = this.comment.childComments;

      return comments ? comments.length : 0;
    }
  },
  data() {
    return {
      newComment: '',
      showChildComments: false,
      showNewCommentForm: false,
      dropdownOptionsComment,
      editing: false,
      editedComment: this.comment.content,
      isShowAllComments: false
    };
  },
  methods: {
    handleViewAllComments() {
      this.$emit('refreshData');
      this.isShowAllComments = false;
    },
    goToOrigin() {
      routerSecureNavigation({
        name: 'blog',
        params: { name: this.originLink }
      });
    },
    /** @TODO revise to use only comment.id in emitter */
    async goToThread(id = this.comment.id) {
      const commentThread = await getComment(id);
      this.$emit('goToThread', commentThread);
      this.isShowAllComments = true;
    },
    async refresh() {
      this.showNewCommentForm = false;
      this.newComment = '';
    },
    async handleCreateComment(parentCommentId) {
      if (!this.newComment) return;

      const payload = {
        alias: this.activeAliasId,
        content: this.newComment
      };

      if (parentCommentId) {
        payload.parentComment = parentCommentId;
      } else {
        payload.blogPost = this.blogPostId;
      }

      try {
        const data = await createComment(payload);
        /** the FE will show as many as possible when the user is just around. but at the modal/page reload, the BE will provide that flag, so the view will be limited */
        if (!this.comment.childComments) {
          this.$set(this.comment, 'childComments', []);
        }
        this.comment.childComments.push(data);
        this.refresh();
        this.showChildComments = true;
      } catch (e) {
        return false;
      }
    },
    /** @TODO resolve all TODOS */
    async handleDeleteComment(id) {
      if (id === this.comment.id) {
        this.$emit('delete', id);
      } else {
        await commentDelete(id, { alias: this.activeAliasId });
        deleteItemById(id, this.comment.childComments);
      }
      this.refresh();
    },
    handleEditComment() {
      this.editedComment = this.content;
      this.editing = true;
    },
    async handleUpdateComment(id) {
      const payload = [id, { content: this.editedComment }];
      const data = await updateComment(...payload);
      Object.assign(this.comment, data);
      this.editing = false;
      await this.refresh();
    },
    openBlogPostModal() {
      if (this.$route.params.postId) return;
      return this.$router.push({
        name: `${this.$route.name}-with-blog-post`,
        params: {
          postId: this.comment.BlogPostId
        }
      });
    },
    async commentLikeToggle() {
      const { id, userLiked, engagementStats } = this.comment;
      const body = [id, { alias: this.activeAliasId }];

      userLiked ? await commentUnlike(...body) : await commentLike(...body);
      userLiked ? engagementStats.likes-- : engagementStats.likes++;
      this.comment.userLiked = !userLiked;
    }
  }
};
</script>
<style lang="scss" scoped>
.comments-list-item {
  display: flex;
  flex-direction: column;
  margin-top: var(--element-margin-s);

  &__wrapper {
    display: flex;
  }
  &__avatar {
    cursor: pointer;
    margin-right: var(--element-margin-m);
  }
  &__content {
    flex-grow: 1;
  }

  .comment {
    margin-bottom: var(--element-padding-s);
  }

  &-title {
    display: flex;
    align-items: center;
    margin-bottom: var(--element-margin-m);
    &__name {
      color: var(--text-primary);
      font-size: var(--size-regular);
      margin-bottom: 0;
      margin-right: var(--element-margin-s);
    }
    &__date {
      color: var(--text-date-and-time);
      font-size: var(--size-small);
      margin-bottom: 0;
      &-standalone {
        cursor: pointer;
      }
    }
  }
  &__text {
    color: var(--text-primary);
    font-size: var(--size-regular);
    line-height: 1.5;
    word-break: break-word;
    margin-bottom: var(--element-margin-m);
    ::v-deep {
      ul {
        margin: var(--element-margin-s);
        padding-left: 40px;
      }

      a {
        color: var(--text-secondary);
      }

      blockquote {
        padding-left: var(--element-padding-s);
        border-left: var(--border-width-default) solid
          var(--border-group-normal);
      }
    }
  }
  &__buttons.active {
    margin-bottom: var(--element-margin-l);
  }
  &__button-thread {
    display: flex;
    outline: none;
    background-color: transparent;
    font-size: var(--size-button);
    text-transform: uppercase;
    font-family: 'OpenSans-Bold', sans-serif;
    color: var(--text-button-comments-show);
    transition: var(--transition-default);
    margin-bottom: var(--element-margin-s);
    &:hover {
      color: var(--BG-button-pagination-active);
    }
    &:hover &-right-arrow {
      border-color: var(--BG-button-pagination-active);
    }
    &:only-child {
      margin-bottom: 0;
    }
  }
}

.child-comment__wrapper {
  margin-left: 65px;
}
</style>

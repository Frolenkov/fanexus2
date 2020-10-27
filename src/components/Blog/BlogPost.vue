<template>
  <article class="blog-post" ref="blogPost" :style="styleObject">
    <div class="blog-post__wrapper" ref="wrapper">
      <blog-post
        v-if="isShared && data.content"
        class="blog-post__reposted"
        :data="data.reblogOfBlogPost"
        :usedInModal="usedInModal"
        :showComments="false"
        :showActionButtons="false"
        :expandable="expandable"
      />
      <header class="blog-post__header" slot="header">
        <author-title
          class="blog-post__header-title"
          @click.native.prevent="() => goToOrigin()"
          @sharedAPostClick="() => goToOrigin(true)"
          :name="data.Alias.name"
          :image="data.Alias.avatar.src"
          :date="data.updatedAt"
          :alt="data.Alias.avatar.alt"
          :isShared="isShared"
          :reblogId="data && data.reblogOfBlogPostId"
        />
        <tags-list
          v-if="data && data.Tags"
          :list="data.Tags"
          @click.native.prevent
          :disabled="disabled"
          @close="$emit('close')"
        />
      </header>
      <div
        class="blog-post__body"
        :class="{
          shrinked: !expanded && expandable && postHeight > postHeightMax
        }"
      >
        <img
          ref="blogPostImage"
          class="blog-post__body-image"
          v-if="data && data.image"
          :src="data.image.src"
          :alt="data.image.name"
        />
        <p
          ref="blogPostText"
          class="blog-post__body-content"
          :class="{ 'has-action': !usedInModal }"
          @click.stop.prevent="handleContentClick"
          v-html="
            isShared && !data.content
              ? data.reblogOfBlogPost.content
              : data.content
          "
        />
        <button
          v-if="expandable && postHeight > postHeightMax"
          type="button"
          @click="expanded = !expanded"
          class="blog-post__expand"
        >
          {{ expanded ? 'Shrink' : 'Expand' }} post
        </button>
      </div>
      <action-buttons-group
        v-if="showActionButtons"
        :engagementStats="data.engagementStats"
        :userHasEditPermissions="data.userHasEditPermissions"
        @click.native.prevent
        @likeClicked="postLikeToggle"
        @delete="deleteBlogPostHandler"
        @edit="editBlogPostHandler"
        :userLiked="data.userLiked"
        :options="dropdownOptions"
        :disabled="disabled"
        @close="$emit('close')"
        @openBlogPostModal="openBlogPostModal"
        @reblog="shareBlogPostHandler"
        :forBlogPost="true"
      />
      <comments
        slot="footer"
        v-if="showComments"
        :blogPostId="data.id"
        :newComment="newComment"
        :comments="data.Comments"
        @createComment="handleCreateComment"
        @delete="handleDeleteComment"
        @refresh="refresh"
        @newCommentInput="$newComment => (newComment = $newComment)"
        @goToThread="$thread => (data.Comments = [$thread])"
        @refreshData="refreshComments"
      />
    </div>
  </article>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { deleteItemById } from '@/utils/array';
import { feedTypes } from '@/services/feed.service';
import { routerSecureNavigation } from '@/services/router.service';
import { postLike, postUnlike } from '@/services/Blog/blog.service';
import dropdownOptions from '@/services/BlogPost/blogPost.dropdownOptions';
import {
  createComment,
  getComment,
  commentDelete
} from '@/services/Comment/comment.service';
import Comments from '@/components/common/Comments/Comments';
import AuthorTitle from '~common/AuthorTitle';
import TagsList from '~common/TagsList';
import ActionButtonsGroup from '~common/ActionButtonsGroup';
import resizeMixin from '@/mixins/resize.mixin';

export default {
  name: 'blog-post',
  props: {
    data: {
      type: Object,
      required: true
    },
    showComments: {
      type: Boolean,
      default: true
    },
    showActionButtons: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    masonry: {
      type: Boolean,
      default: true
    },
    usedInModal: {
      type: Boolean,
      default: false
    },
    expandable: {
      type: Boolean,
      default: false
    }
  },
  components: {
    AuthorTitle,
    TagsList,
    ActionButtonsGroup,
    Comments
  },
  mixins: [resizeMixin],
  data() {
    return {
      newComment: '',
      dropdownOptions,
      isMounted: false,
      expanded: false,
      postHeight: 0,
      postHeightMax: 450,
      firstCommentId: null
    };
  },
  methods: {
    ...mapActions([
      'updateBlogPostData',
      'deleteBlogPost',
      'setEditBlogPost',
      'setImagePreviewSrc',
      'setShareBlogPost'
    ]),
    async refreshComments() {
      if (this.firstCommentId) {
        this.$emit('refreshData');
      }
    },
    goToOrigin(isReblog = false) {
      const origin = isReblog
        ? this.data.reblogOfBlogPost.origin
        : this.data.origin;
      const link = isReblog ? this.reblogOfBlogPostOriginLink : this.originLink;
      if (
        !origin ||
        !link ||
        this.$route.params.name === link ||
        this.$route.params.id === link
      )
        return;

      const param = origin.type === feedTypes.blog ? 'name' : 'id';
      const name = isReblog ? `${origin.type}-with-blog-post` : origin.type;
      const params = isReblog
        ? { [param]: link, postId: this.data.reblogOfBlogPostId }
        : { [param]: link };

      routerSecureNavigation({ name, params });
    },
    async deleteBlogPostHandler() {
      await this.deleteBlogPost({
        id: this.data.id,
        payload: { alias: this.activeAliasId }
      });
      await this.updateBlogPostData(this.data.id);
    },
    editBlogPostHandler() {
      this.setEditBlogPost({ data: this.data });
    },
    shareBlogPostHandler() {
      this.setShareBlogPost({ data: this.data });
    },
    async refresh() {
      this.newComment = '';
    },
    async handleDeleteComment(id) {
      const { Comments } = this.data;
      let parentCommentId;

      await commentDelete(id, { alias: this.activeAliasId });

      if (Comments.length === 1 && Comments[0].parentCommentId) {
        parentCommentId = Comments[0].parentCommentId;
      }
      deleteItemById(id, Comments);

      if (!Comments.length) {
        if (parentCommentId) {
          const data = await getComment(parentCommentId);
          this.data.Comments = [data];

          if (!data.parentCommentId) {
            // we'll track that field in Comment.vue in order to show "View all comments" button
            data.lastCommentThread = true;
          }
        } else {
          this.refreshComments();
        }
      }

      this.refresh();
    },
    /*@TODO make it dynamic and revise do we need comment id*/
    async handleCreateComment(parentComment) {
      if (!this.newComment) return;

      const payload = {
        alias: this.activeAliasId,
        content: this.newComment
      };
      if (parentComment) {
        payload.parentComment = parentComment;
      } else {
        payload.blogPost = this.data.id;
      }

      try {
        const data = await createComment(payload);
        this.data.Comments.push(data);
        this.refresh();
      } catch (e) {
        return false;
      }
    },
    handleContentClick(e) {
      const { tagName, src } = e.target;

      if (tagName === 'IMG' && src) {
        this.setImagePreviewSrc(src);
        return;
      }

      this.openBlogPostModal();
    },
    openBlogPostModal() {
      if (this.usedInModal) return;

      return this.$router.push({
        name: `${this.$route.name}-with-blog-post`,
        params: {
          postId: this.data.id
        }
      });
    },
    async postLikeToggle() {
      const { id, userLiked, engagementStats } = this.data;
      const body = [id, { alias: this.activeAliasId }];

      userLiked ? await postUnlike(...body) : await postLike(...body);
      userLiked ? engagementStats.likes-- : engagementStats.likes++;
      this.data.userLiked = !userLiked;
    }
  },
  computed: {
    ...mapState({
      userData: state => state.auth.userData,
      activeAliasId: state => state.alias.activeAliasId
    }),
    isShared() {
      return !!(this.data && this.data.reblogOfBlogPost);
    },
    originLink() {
      const {
        origin: { link, id }
      } = this.data;

      return link || id;
    },
    reblogOfBlogPostOriginLink() {
      if (!this.isShared) return null;

      const {
        origin: { link, id }
      } = this.data.reblogOfBlogPost;

      return link || id;
    },
    styleObject() {
      if (
        (!this.resizeCounter && !this.isMounted) ||
        !this.masonry ||
        this.usedInModal
      )
        return;
      /** @TODO take those from the variable @see https://temperance-software.atlassian.net/browse/FAN-219 */
      const rowHeight = 20; // It's from NewsFeed.vue .feed-news grid-auto-rows
      const rowGap = 15; // It's from NewsFeed.vue .feed-news grid-gap
      const rowSpan = Math.ceil(
        (this.$refs.wrapper.clientHeight + rowGap) / (rowHeight + rowGap)
      );
      return {
        gridRowEnd: `span ${rowSpan}`
      };
    }
  },
  watch: {
    resizeCounter: {
      handler() {
        const { blogPostText, blogPostImage } = this.$refs;
        this.postHeight = 0;

        if (blogPostText) {
          this.postHeight += blogPostText.clientHeight;
        }

        if (blogPostImage) {
          this.postHeight += blogPostImage.clientHeight;
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.isMounted = true;
    if (this.data.Comments && this.data.Comments[0]) {
      this.firstCommentId = this.data.Comments[0]?.id;
    }
    this.resizeObserver(this.$refs.wrapper);
  }
};
</script>
<style lang="scss" scoped>
.feed-news .blog-post {
  &:hover {
    box-shadow: var(--box-shadow);
    /** @TODO revise styles */
    // cursor: pointer;
  }
}
.blog-post {
  background-color: var(--BG-blog-post);
  border-radius: var(--border-radius);
  transition: var(--transition-default);
  &__reposted {
    border-bottom: var(--border-width-default) solid
      var(--BG-button-secondary-disabled);
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    &:hover {
      box-shadow: none;
    }
  }
  &__expand {
    width: 100%;
    padding: var(--element-padding-m) 0;
    text-transform: uppercase;
    bottom: 0;
    left: 0;
    background: linear-gradient(to top, var(--BG-expand));
    color: var(--text-button);
    font-size: var(--size-regular);
    font-weight: 600;
    transition: var(--transition-default);
    &:hover {
      color: var(--text-button-hover);
    }
    &:focus {
      outline: none;
    }
  }
  &__header {
    margin: 0 var(--element-margin-l);
    padding-top: var(--element-padding-l);
    &-title {
      cursor: pointer;
    }
  }
  &__body {
    position: relative;
    max-height: unset;
    &.shrinked {
      max-height: 300px;
      overflow: hidden;
      .blog-post__expand {
        position: absolute;
      }
    }

    &-image {
      width: 100%;
      height: auto;
      object-fit: cover;
    }
    &-content {
      color: var(--text-primary);
      font-size: var(--size-regular);
      line-height: 1.3em;
      margin: 0;
      padding: 0 var(--element-padding-m) var(--element-padding-m);
      word-break: break-word;
      &.has-action {
        cursor: pointer;
      }

      /** @TODO revise styles */
      ::v-deep {
        a {
          color: var(--text-secondary);
          display: block;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        h1,
        h2 {
          line-height: 1.5em;
        }

        ul {
          padding-left: var(--element-padding-xl);
        }

        img {
          margin: var(--element-margin-s) 0;
          cursor: zoom-in;
        }

        blockquote {
          padding-left: var(--element-padding-s);
          border-left: var(--border-width-default) solid
            var(--border-group-normal);
        }
      }
    }
  }
}
</style>

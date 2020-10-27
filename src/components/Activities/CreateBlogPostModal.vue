<template>
  <div class="create-post-modal-wrapper">
    <modal
      class="create-post-modal modal-overlay--centered"
      :tags="tagItems"
      :settings="settings"
      @save="handleSave"
    >
      <template slot="body">
        <h3 class="title-wrapper">Tags</h3>
        <tag-input
          class="post-tags-input"
          :list="editorTags"
          @listChange="updateList"
          placeholder="Add tag"
        />
        <form-rich-text-editor v-model="editorValue" />
        <h3 class="title-wrapper">
          Publish post
        </h3>
        <div v-if="eligibleShareToEntities" class="selects-wrapper">
          <form-select
            title="Publish to"
            :options="publishToOptions"
            v-model="publishTo"
            name="publish-direction"
            optionsType="radiobuttons"
            class="wide"
          />
        </div>
        <h3 class="title-wrapper">
          Share post
        </h3>
        <div v-if="eligibleShareToEntities" class="selects-wrapper">
          <form-select
            title="Blog name"
            :options="shareToBlogOptions"
            v-model="shareTo.blogs"
            name="share-to-blogs"
          />
          <form-select
            title="Community name"
            :options="shareToCommunityOptions"
            v-model="shareTo.communities"
            name="share-to-communities"
          />
        </div>
        <h3 class="title-wrapper">Visibility privacy groups</h3>
        <privacy-group-selection v-model="selectedPrivacyGroups.visibility" />
        <h3 class="title-wrapper">Commenting privacy groups</h3>
        <privacy-group-selection v-model="selectedPrivacyGroups.commenting" />
        <blog-post
          v-if="sharingBlogPost"
          class="section-blog-post"
          :data="sharedBlogPostData"
          :usedInModal="true"
          :show-comments="false"
          :show-action-buttons="false"
        />
      </template>
    </modal>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
/** @TODO add to a corresponding mixin */
import { feedTypes } from '@/services/feed.service';
import Modal from '../common/Modal';
import TagInput from '../common/Fields/TagInput';
import FormRichTextEditor from '../common/Fields/FormRichTextEditor';
import FormSelect from '../common/Fields/FormSelect';
import {
  createBlogPost,
  editBlogPost,
  getEligibleShareToEntitiesForAlias
} from '@/services/Blog/blog.service';
import BlogPost from '../Blog/BlogPost';
import PrivacyGroupSelection from '@/components/PrivacyGroup/PrivacyGroupSelection.vue';

export default {
  components: {
    Modal,
    TagInput,
    FormRichTextEditor,
    FormSelect,
    BlogPost,
    PrivacyGroupSelection
  },
  props: {
    settings: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      alias: null,
      eligibleShareToEntities: null,
      publishTo: null,
      shareTo: {
        blogs: [],
        communities: []
      },
      selectedPrivacyGroups: {
        visibility: [],
        commenting: []
      }
    };
  },
  methods: {
    ...mapActions(['getFeedData', 'setBlogPostContent', 'setBlogPostTags']),
    /** @TODO fix form-rich text editor issue, when we click first time */
    handleSave() {
      if (this.sharingBlogPost) {
        this.shareBlogpost();
      } else if (this.blogPostId) {
        this.updateBlogPost();
      } else {
        this.createBlogPost();
      }
    },
    async createBlogPost(reblogOfBlogPost = null) {
      const payload = {
        alias: this.activeAliasId,
        content: this.currentEditorValue,
        shareTo: {
          blogs: this.shareTo.blogs.map(({ id }) => id),
          communities: this.shareTo.communities.map(({ id }) => id)
        },
        [this.publishTo.feedType]: this.publishTo.id,
        tagNames: this.blogPostTags,
        reblogOfBlogPost,
        viewingPrivacyGroups: this.selectedPrivacyGroups.visibility.map(
          privacyGroup => privacyGroup.id
        ),
        commentingPrivacyGroups: this.selectedPrivacyGroups.visibility.map(
          privacyGroup => privacyGroup.id
        )
      };
      await createBlogPost(payload);

      const {
        meta: { page },
        params: { id, name: paramsName }
      } = this.$route;
      const getFeedPayload =
        page === feedTypes.community ? { id } : { name: paramsName };
      /** @TODO revise */
      this.getFeedData({ ...getFeedPayload, pagination: 1, type: page });
    },
    async updateBlogPost() {
      const payload = {
        alias: this.activeAliasId,
        content: this.editorValue,
        tagNames: this.editorTags
      };
      await editBlogPost(this.blogPostId, payload);

      const {
        meta: { page },
        params: { id, name: paramsName }
      } = this.$route;
      const createFeedPayload =
        page === feedTypes.community ? { id } : { name: paramsName };
      this.getFeedData({ ...createFeedPayload, pagination: 1, type: page });
    },
    async shareBlogpost() {
      const { reblogOfBlogPostId } = this.sharedBlogPostData;
      const postIdToShare = this.sharedBlogPostData.content.trim().length
        ? this.blogPostId
        : reblogOfBlogPostId || this.blogPostId;

      await this.createBlogPost(postIdToShare);
    },
    updateList(list) {
      this.editorTags = list;
    },
    async getEligibleShareToEntities() {
      this.eligibleShareToEntities = await getEligibleShareToEntitiesForAlias({
        alias: this.activeAliasId
      });
    },
    setDefaultPublishTo() {
      this.publishTo = {
        feedType: this.sharingBlogPost ? feedTypes.blog : this.feedType,
        id: this.feedData.id
      };
    }
  },
  computed: {
    ...mapState({
      activeAliasBlogId: state => state.alias.activeAliasBlog.id,
      activeAliasId: state => state.alias.activeAliasId,
      currentEditorValue: state => state.blogPost.data.content,
      blogPostTags: state => state.blogPost.data.Tags.map(tag => tag.name),
      blogPostId: state =>
        !state.blogPost.sharingBlogPost
          ? state.blogPost.data.id
          : state.blogPost.shareData.id,
      sharingBlogPost: state => state.blogPost.sharingBlogPost,
      feedData: state => state.feed.data,
      feedType: state => state.feed.type,
      sharedBlogPostData: state =>
        !state.blogPost.sharingBlogPost
          ? state.blogPost.data
          : state.blogPost.shareData
    }),
    tagItems() {
      return this.editorTags.map(tag => ({
        name: tag,
        id: 0
      }));
    },
    editorValue: {
      get() {
        return this.currentEditorValue;
      },
      set(value) {
        this.setBlogPostContent(value);
      }
    },
    editorTags: {
      get() {
        return this.blogPostTags;
      },
      set(value) {
        this.setBlogPostTags(value);
      }
    },
    shareToBlogOptions() {
      return this.eligibleShareToEntities.eligibleBlogs.map(({ id, name }) => ({
        label: name,
        value: { id, feedType: feedTypes.blog }
      }));
    },
    shareToCommunityOptions() {
      return this.eligibleShareToEntities.eligibleCommunities.map(
        ({ id, name }) => ({
          label: name,
          value: { id, feedType: feedTypes.community }
        })
      );
    },
    publishToOptions() {
      return this.shareToBlogOptions
        .map(({ label, value }) => ({ label: `Blog: ${label}`, value }))
        .concat(
          this.shareToCommunityOptions.map(({ label, value }) => ({
            label: `Community: ${label}`,
            value
          }))
        );
    }
  },
  mounted() {
    this.getEligibleShareToEntities();
    this.setDefaultPublishTo();
  }
};
</script>

<style lang="scss" scoped>
.create-post-modal {
  &.modal-overlay--centered {
    .selects-wrapper {
      display: flex;
    }

    .title-wrapper {
      font-size: var(--size-regular);
      font-family: 'OpenSans-Bold', sans-serif;
      margin-bottom: var(--element-margin-m);
      color: var(--text-primary);
    }

    .post-tags-input {
      margin-bottom: var(--element-margin-s);
    }
  }
}

.wide {
  min-width: 250px;
}

::v-deep {
  .rich-text-editor .textarea {
    min-height: 214px;
  }
  .select-options-container {
    margin-bottom: 0;
  }

  .modal {
    margin: 0 auto;
    width: var(--width-medium);
    overflow: visible;

    &-content {
      margin: 0;
    }
  }
  .modal-header,
  .modal-footer {
    background-color: var(--BG-create-post-modal);
  }
  .modal-body {
    background-color: var(--BG-create-post-modal-body);
  }
  .select {
    width: 170px;
    min-width: 170px;
    margin: 0 var(--element-margin-s) var(--element-margin-l) 0;
    &.wide {
      width: 300px;
      min-width: 300px;
    }

    button,
    ul {
      border-color: var(--tab-normal);
    }
    button {
      padding: var(--button-padding-s) var(--element-padding-s);
    }

    &:last-child {
      margin-right: 0;
    }
  }

  .form-input input {
    padding: var(--element-padding-xs) var(--element-padding-xs)
      var(--element-padding-xs) var(--element-padding-xl);
  }
  .tags-list {
    padding: 0 0 var(--element-padding-l) 0;
    &__item {
      padding: var(--element-padding-s);
    }
  }
}
</style>

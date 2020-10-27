<template>
  <!-- /*@TODO check out logged-in class condition*/ -->
  <div class="wrapper layout" :class="{ logged: isAuthenticated }">
    <fanexus-aside-menu
      v-if="isAuthenticated"
      :show="asideToggled"
      @asideToggled="handleAsideToggled"
    />
    <fanexus-header
      @openAuthModal="handleOpenAuthModal"
      @openCreatePostModal="handleOpenCreatePostModal"
    />
    <create-post-modal
      v-if="createPostModalSettings.show"
      :settings="createPostModalSettings"
    />
    <blog-post-modal
      v-if="$route.params.postId"
      :settings="blogModalSettings"
    />
    <auth
      v-if="authModalSettings.show"
      :settings="authModalSettings"
      @submit="handleAuthSubmit"
    />
    <image-preview-modal v-if="imagePreviewSrc" />
    <blog-edit-modal
      v-if="blogEditModalSettings.show"
      :settings="blogEditModalSettings"
      :name="$route.params.name"
    />
    <community-edit-modal
      v-if="communityEditModalSettings.show"
      :settings="communityEditModalSettings"
      :id="$route.params.id"
    />
    <slot />
  </div>
</template>

<script>
import { APP_TITLE } from '@/services/config';
import Auth from '@/components/Auth/Auth';
import FanexusHeader from '@/components/Layout/Header';
import FanexusAsideMenu from '@/components/Layout/AsideMenu';
import BlogPostModal from '@/components/Blog/BlogPostModal.vue';
import { mapActions, mapState } from 'vuex';
import CreatePostModal from '@/components/Activities/CreateBlogPostModal';
import ImagePreviewModal from '@/components/common/ImagePreviewModal';
import { blogPostEditorTitles } from '@/services/BlogPost/blogPost.service';
import BlogEditModal from '@/components/Blog/BlogEditModal.vue';
import CommunityEditModal from '@/components/Community/CommunityEditModal.vue';

export default {
  components: {
    Auth,
    CreatePostModal,
    BlogPostModal,
    FanexusHeader,
    FanexusAsideMenu,
    ImagePreviewModal,
    BlogEditModal,
    CommunityEditModal
  },
  data() {
    const context = this;
    return {
      asideToggled: false,
      authModalSettings: {
        title: APP_TITLE,
        show: false,
        auth: true,
        initialTab: []
      },
      blogModalSettings: {
        hideHeader: true,
        get show() {
          return (
            !isNaN(Number(context.$route.params.postId)) &&
            !context.editingBlogPost
          );
        }
      },
      createPostModalSettings: {
        get show() {
          return context.editingBlogPost;
        },
        set show(value) {
          context.setEditingBlogPost(value);
        },
        get title() {
          return `${context.createPostModalTitle} post`;
        },
        dismissText: 'Cancel',
        actionText: 'Publish'
      },
      editTagsModalSettings: {
        title: 'Edit tags',
        dismissText: 'Cancel',
        actionText: 'Save tags',
        get show() {
          return context.showEditTagsModal;
        },
        set show(value) {
          context.openEditTagsModal(value);
        }
      },
      blogEditModalSettings: {
        title: 'Edit blog profile',
        dismissText: 'Cancel',
        actionText: 'Save',
        get show() {
          return context.$route.name === 'edit-blog';
        },
        set show(value) {
          if (!value) {
            context.$router.push({
              name: context.$route.name.replace('edit-', '')
            });
          }
        }
      },
      communityEditModalSettings: {
        title: 'Edit community',
        dismissText: 'Cancel',
        actionText: 'Save',
        get show() {
          return context.$route.name === 'edit-community';
        },
        set show(value) {
          if (!value) {
            context.$router.push({
              name: context.$route.name.replace('edit-', '')
            });
          }
        }
      },
      blogPostEditorTitles
    };
  },
  computed: {
    ...mapState({
      isAuthenticated: state => state.auth.isAuthenticated,
      showEditTagsModal: state => state.tags.showEditTagsModal,
      showBlogEditModal: state => state.feed.showBlogEditModal,
      showCommunityEditModal: state => state.feed.showCommunityEditModal,
      blogPostEditContent: state => state.blogPost.data.content,
      editingBlogPost: state => state.blogPost.editingBlogPost,
      newBlogPost: state => !state.blogPost.data.id,
      imagePreviewSrc: state => state.blogPost.imagePreviewSrc,
      sharingBlogPost: state => state.blogPost.sharingBlogPost
    }),
    createPostModalTitle() {
      if (this.sharingBlogPost) {
        return blogPostEditorTitles.share;
      } else if (this.newBlogPost) {
        return blogPostEditorTitles.newPost;
      }
      return blogPostEditorTitles.editPost;
    }
  },
  methods: {
    ...mapActions([
      'openEditTagsModal',
      'setCreateBlogPost',
      'setEditBlogPost',
      'setEditingBlogPost'
    ]),

    handleOpenAuthModal({ tabIndex, componentIndex }) {
      this.authModalSettings.initialTab = [tabIndex, componentIndex];
      this.authModalSettings.show = true;
    },
    /*@TODO revise to respect the create account option*/
    handleAuthSubmit() {
      this.authModalSettings.show = false;
    },
    handleAsideToggled() {
      this.asideToggled = !this.asideToggled;
    },
    handleOpenCreatePostModal() {
      this.setEditBlogPost();
    }
  }
};
</script>

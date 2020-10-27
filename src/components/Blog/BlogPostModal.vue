<template>
  <!-- @TODO test on small height screens -->
  <modal
    class="blog-post modal-overlay--centered"
    v-if="data"
    :settings="settings"
    @close="close"
  >
    <blog-post
      slot="body"
      :data="data"
      @close="close"
      @refreshData="getBlogPostApi"
      :usedInModal="true"
    />
  </modal>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import { getBlogPost } from '@/services/Blog/blog.service';
import Modal from '~common/Modal';
import BlogPost from '@/components/Blog/BlogPost';
import { getById } from '@/utils/array.js';

export default {
  components: {
    Modal,
    BlogPost
  },
  props: {
    settings: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      blogPostApi: null
    };
  },
  computed: {
    /** @TODO make it common between @see 'src\components\Blog\SharePostModal.vue' */
    ...mapState({
      blogPosts: state => state.feed.data.BlogPosts
    }),
    blogPostStore() {
      return getById(this.postId, this.blogPosts);
    },
    postId() {
      return Number(this.$route.params.postId);
    },
    data() {
      return this.blogPostStore || this.blogPostApi;
    }
  },
  methods: {
    ...mapActions(['updateBlogPostData']),
    close() {
      return this.$router.push({
        name: this.$route.meta.page
      });
    },
    async getBlogPostApi() {
      if (!this.blogPostStore) {
        this.blogPostApi = await getBlogPost(this.postId);
      } else {
        this.updateBlogPostData(this.postId);
      }
    }
  },
  async mounted() {
    await this.getBlogPostApi();
  }
};
</script>
<style lang="scss" scoped>
::v-deep {
  .blog-post {
    &-header {
      margin: 0 var(--element-margin-l);
    }
    &-body {
      &__image {
        width: 100%;
        height: auto;
        object-fit: cover;
      }
      &__content {
        color: var(--text-primary);
        font-size: var(--size-regular);
        line-height: 1.3em;
        margin: var(--element-margin-l);
      }
    }
  }
  .modal {
    width: var(--width-large);

    margin: 20px auto;

    &-content {
      margin: 0;
      border-radius: 0;
    }
    &-header {
      margin: 0;
      padding: 0;
      &-btn__close {
        top: 20px;
        right: 20px;
        transform: initial;
        z-index: var(--z-index-1);
      }
    }
    &-body {
      padding: 0;
    }
    &-footer {
      padding: 0;
    }
  }
}
</style>

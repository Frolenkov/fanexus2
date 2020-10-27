<template>
  <div class="blog-card">
    <div class="blog-card__image">
      <router-link :to="{ name: blogRoot, params: { name: blogUrl } }">
        <img :src="src" :alt="blogName" />
      </router-link>
    </div>
    <div class="blog-card__details">
      <div class="blog-card__text">
        <div class="blog-card__name">
          <router-link
            class="blog-card__link"
            :to="{ name: blogRoot, params: { name: blogUrl } }"
          >
            {{ blogName }}
          </router-link>
        </div>
        <div class="blog-card__description" v-html="data.description" />
      </div>
    </div>
  </div>
</template>

<script>
import { blogRoot } from '@/services/Blog/blog.service';

export default {
  props: {
    src: {
      type: String,
      default: require('@/assets/img/png/Image_8.png')
    },
    data: {
      type: Object
    },
    blogName: {
      type: String
    }
  },
  data() {
    return {
      blogRoot
    };
  },
  computed: {
    blogUrl() {
      return this.data.link || this.data.id;
    }
  }
};
</script>
<style lang="scss" scoped>
.blog-card {
  display: flex;
  border-radius: var(--border-radius);
  background-color: var(--BG-blog-post);
  transition: var(--transition-default);
  padding: var(--element-padding-m) var(--element-padding-l);
  &:hover {
    box-shadow: var(--box-shadow);
  }

  &__image {
    border-radius: var(--border-radius);
    max-width: 20%;
    max-height: 100%;

    img {
      display: block;
    }
  }

  &__details {
    margin-left: var(--element-margin-m);
  }
  &__text {
    color: var(--text-primary);
    font-size: var(--size-regular);
  }
  &__name {
    font-family: 'OpenSans-Bold', sans-serif;
  }
  &__link {
    text-decoration: none;
    color: var(--text-primary);
  }
  &__description {
    margin-top: var(--element-margin-xs);
  }
}
</style>

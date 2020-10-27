<template>
  <div class="popular-blog">
    <div class="popular-blog-head">
      <!-- @TODO switch key to blogInfo.link in the future to get link as a param  -->
      <router-link
        class="popular-blog__link"
        :to="{
          name: 'community',
          params: { id: blogInfo.link || blogInfo.id }
        }"
      >
        <avatar
          v-if="blogInfo.avatar && blogInfo.avatar.src"
          size="sm"
          :file="blogInfo.avatar.src"
        />
      </router-link>
      <router-link
        class="popular-blog__link"
        :to="{
          name: 'community',
          params: { id: blogInfo.link || blogInfo.id }
        }"
      >
        {{ blogInfo.name }}
      </router-link>
    </div>

    <!-- change every similar block to use v-html instead of string interpolation -->
    <p class="popular-blog__desc" v-html="blogInfo.description" />
  </div>
</template>
<script>
import Avatar from '~common/Avatar';

export default {
  components: {
    Avatar
  },
  props: {
    blogInfo: {
      type: Object,
      required: true
    }
  }
};
</script>
<style lang="scss" scoped>
.popular-blog {
  padding-bottom: var(--element-padding-m);
  margin-bottom: var(--element-margin-m);
  border-bottom: var(--border-width-thin) solid var(--popular-blog-divider);

  &-head {
    font-family: 'OpenSans-Bold', sans-serif;
    display: flex;
    align-items: center;
    font-size: var(--size-regular);
    margin-bottom: var(--element-margin-m);
    ::v-deep img {
      margin-right: var(--element-margin-s);
    }
  }

  &__link {
    color: var(--text-primary);
    font-size: var(--size-regular);
    margin-bottom: 0;
    text-decoration: none;
    word-break: break-word;
  }
  &__desc {
    font-size: var(--size-button);
    color: var(--text-primary);
    line-height: 1.5em;
    letter-spacing: 0.12px;
    margin-bottom: 0;
    word-break: break-word;
  }
}
</style>

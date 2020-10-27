<template>
  <div class="sidebar-tag-counts">
    <h3 class="sidebar-tag-counts__title">Blog post tags</h3>
    <tags-list
      :list="sortedTags"
      :go-to-feed="true"
      :current-tags="currentTags"
    />
    <template v-if="currentTags.length">
      <h4 class="sidebar-tag-counts__subtitle">Currently selected</h4>
      <tags-list
        :list="currentTagObjects"
        :remove-from-feed="true"
        :current-tags="currentTags"
        @remove-tag="removeTag"
      />
    </template>
  </div>
</template>

<script>
import { routerSecureNavigation } from '@/services/router.service';
import TagsList from '~common/TagsList';

export default {
  props: {
    tags: {
      type: Array,
      required: true
    },
    currentTags: {
      type: Array,
      default: () => []
    }
  },
  components: {
    TagsList
  },
  computed: {
    sortedTags() {
      return this.tags
        .filter(tag => !this.currentTags.includes(tag.name))
        .sort((tag1, tag2) => tag2.tagCount - tag1.tagCount);
    },
    currentTagObjects() {
      return this.tags
        .filter(tag => this.currentTags.includes(tag.name))
        .sort((tag1, tag2) => tag2.tagCount - tag1.tagCount);
    }
  },
  methods: {
    removeTag(tagName) {
      this.currentTags.splice(
        this.currentTags.findIndex(currentTag => currentTag.name === tagName),
        1
      );
      routerSecureNavigation({
        ...(!this.currentTags.length && {
          name: this.$route.name.replace('-by-tags', '')
        }),
        params: {
          tagNames: JSON.stringify(this.currentTags),
          order: this.$route.params.order
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.sidebar-tag-counts {
  background-color: var(--BG-blog-post);
  display: flex;
  flex-direction: column;
  border-radius: var(--border-radius);
  padding: var(--element-padding-l);
  color: var(--text-primary);
  font-size: var(--size-regular);
  &__title {
    text-align: center;
    font-size: var(--size-title);
    font-family: 'OpenSans-Bold';
    margin-bottom: var(--element-margin-m);
  }
  &__subtitle {
    text-align: center;
    margin-bottom: var(--element-margin-xs);
  }
}
</style>

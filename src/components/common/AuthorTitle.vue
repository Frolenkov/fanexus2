<template>
  <div class="author-title" :class="{ 'is-valid-date': isValidDate }">
    <avatar :size="imageSize" :file="image" :alt="alt" />
    <div class="author-title-text">
      <h2 class="author-title__name" :class="{ shared: isShared }">
        {{ name }}
      </h2>
      <p
        v-if="isShared"
        class="author-title__shared"
        @click.stop="$emit('sharedAPostClick')"
      >
        Shared a post
      </p>
      <p class="author-title__date" v-if="isValidDate">
        {{ date | dateFormat }}
      </p>
      <slot />
    </div>
  </div>
</template>
<script>
import { isValidDate } from '@/filters/date.filter';
import Avatar from '~common/Avatar';
export default {
  components: {
    Avatar
  },
  props: {
    id: {
      type: [String, Number]
    },
    link: {
      type: [String, Number]
    },
    imageSize: {
      type: String
    },
    image: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    date: {
      type: String
    },
    alt: {
      type: String,
      default: 'avatar'
    },
    isShared: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isValidDate() {
      return isValidDate(this.date);
    }
  }
};
</script>
<style lang="scss" scoped>
.author-title {
  display: flex;
  margin-bottom: var(--element-margin-s);
  &-text {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: var(--element-margin-s);
  }
  &__name {
    color: var(--text-primary);
    font-size: var(--size-regular);
    word-break: break-word;
    margin-bottom: var(--element-margin-s);
  }
  &__shared,
  &__date {
    color: var(--text-date-and-time);
    font-size: var(--size-small);
    margin-bottom: 0;
  }
  &__shared {
    color: var(--text-primary);
    margin-bottom: var(--element-margin-xs);
    &:hover {
      color: var(--BG-button-secondary-hover);
      transition: var(--transition-default);
    }
  }
  &.is-valid-date {
    .author-title-text {
      justify-content: flex-start;
    }
    .author-title__name {
      margin-bottom: var(--element-margin-m);
      &.shared {
        margin-bottom: var(--element-margin-xs);
      }
    }
  }
}
</style>

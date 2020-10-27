<template>
  <!-- take a conversation with @Vika if we need more editable field via props here -->
  <div class="sidebar-info">
    <h3 v-if="name" class="sidebar-info__title">{{ name }}</h3>
    <template v-if="!isEditable">
      <template v-if="feedType === feedTypes['community']">
        <form-button
          class="sidebar-info__button"
          @click.native.stop="$emit('join')"
          type="submit"
          text="Join"
          v-if="!isMember && !membershipPending"
        />
        <form-button
          class="sidebar-info__button"
          type="info"
          text="Membership pending"
          v-else-if="!isMember"
        />
        <form-button
          class="sidebar-info__button"
          @click.native.stop="$emit('leave')"
          type="cancel"
          text="Leave"
          v-else
        />
      </template>
      <form-button
        class="sidebar-info__button"
        type="cancel"
        text="Unsubscribe"
        @click.native.stop="$emit('unsubscribe')"
        v-if="isSubscribe"
      />
      <form-button
        class="sidebar-info__button"
        type="submit"
        text="Subscribe"
        @click.native.stop="$emit('subscribe')"
        v-else
      />
    </template>
    <form-button
      class="sidebar-info__button"
      type="submit"
      text="Edit"
      @click.native.stop="$emit('edit')"
      v-else
    />
    <p class="sidebar-info__desc" v-html="description">{{ description }}</p>
    <template v-if="tags.length">
      <h4 class="sidebar-info__subtitle">Tags</h4>
      <tags-list :list="tags" />
    </template>
    <h4 class="sidebar-info__subtitle">{{ subtitle }}</h4>
    <ul class="sidebar-info-list">
      <li
        class="sidebar-info-list__item text-overflow"
        :key="index"
        v-for="(link, index) in links"
        v-html="link"
      ></li>
    </ul>
  </div>
</template>
<script>
import FormButton from '~common/Buttons/FormButton';
import { feedTypes } from '@/services/feed.service';
import TagsList from '~common/TagsList';

export default {
  components: {
    FormButton,
    TagsList
  },
  props: {
    name: {
      type: String,
      required: true
    },
    feedType: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    tags: {
      type: Array,
      default: () => []
    },
    links: {
      type: Array
    },
    isMember: {
      type: Boolean
    },
    membershipPending: {
      type: Boolean
    },
    isSubscribe: {
      type: Boolean
    },
    isEditable: {
      type: Boolean,
      default: false
    },
    subtitle: {
      type: String,
      default: 'My links'
    }
  },
  data() {
    return {
      feedTypes
    };
  }
};
</script>
<style lang="scss" scoped>
.sidebar-info {
  background-color: var(--BG-blog-post);
  display: flex;
  flex-direction: column;
  border-radius: var(--border-radius);
  padding: var(--element-padding-l);
  color: var(--text-primary);
  font-size: var(--size-regular);
  &__title {
    font-family: 'OpenSans-Bold';
    font-size: var(--size-primary);
    text-align: center;
    margin-bottom: var(--element-margin-m);
    word-break: break-word;
  }
  &__desc {
    line-height: 1.5em;
    margin: var(--element-margin-m) 0;
    word-wrap: break-word;
  }
  &__subtitle {
    font-family: 'OpenSans-Bold';
    margin-bottom: var(--element-margin-s);
  }
  &-list {
    list-style: none;
    margin: 0;
    &__item {
      padding-bottom: var(--element-padding-s);
      ::v-deep a {
        color: var(--text-secondary);
      }
    }
  }
  &__button:not(:first-child) {
    margin-top: var(--element-margin-xs);
  }
}
</style>

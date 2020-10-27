<template>
  <ul class="privacy-group-list">
    <li
      class="privacy-group-list__add-button"
      @click="$emit('create-new-privacy-group')"
    >
      <div>Privacy groups</div>
      <div><plus-icon /></div>
    </li>
    <li
      :class="{
        'current-privacy-group': privacyGroup.id === currentPrivacyGroup.id
      }"
      v-for="(privacyGroup, index) in privacyGroups"
      :key="`${privacyGroup.id}-${index}`"
      @click="$emit('set-privacy-group', privacyGroup)"
    >
      {{ privacyGroup.name }}
    </li>
  </ul>
</template>

<script>
import PlusIcon from '~svg/plus.svg';

export default {
  props: {
    privacyGroups: {
      type: Array,
      default: () => []
    },
    currentPrivacyGroup: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    PlusIcon
  }
};
</script>

<style lang="scss" scoped>
.privacy-group-list {
  list-style: none;

  li {
    padding: var(--element-padding-xs);
    color: var(--text-primary);
    cursor: pointer;

    &:hover {
      background-color: var(--BG-button-primary-hover);
      color: var(--tab-active);
    }

    &.current-privacy-group {
      color: inherit;
      background-color: var(--BG-button-secondary-hover);
    }
  }

  &__add-button {
    display: flex;
    justify-content: space-between;
  }
}
</style>

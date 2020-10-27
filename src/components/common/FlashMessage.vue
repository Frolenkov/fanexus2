<template>
  <div class="flash-message">
    <div class="flash-message__container">
      {{ message }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      required: true
    }
  }
};
</script>

<style lang="scss" scoped>
.flash-message {
  position: fixed;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  bottom: var(--element-margin-xl);
  display: flex;
  justify-content: center;

  &__container {
    border-radius: var(--border-radius);
    padding: var(--element-padding-s);
    border: var(--border-width-default) solid var(--border-success);
    background-color: var(--BG-blog-post);
    color: var(--text-primary);
  }
}
</style>

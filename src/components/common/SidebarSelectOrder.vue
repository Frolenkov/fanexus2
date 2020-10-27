<template>
  <div class="sidebar-select-order">
    <h4 class="sidebar-select-order__title">Order by</h4>
    <form-select
      v-model="currentSelection"
      :options="blogPostOrders"
      name="blog-post-order"
      optionsType="radiobuttons"
    />
  </div>
</template>

<script>
import { blogPostOrders } from '@/services/BlogPost/blogPost.service';
import FormSelect from '~common/Fields/FormSelect';

export default {
  props: {
    selected: {
      validator: value =>
        blogPostOrders.map(blogPostOrder => blogPostOrder.value).includes(value)
    }
  },
  components: {
    FormSelect
  },
  data() {
    return {
      blogPostOrders,
      currentSelection: this.selected
    };
  },
  watch: {
    currentSelection(value) {
      this.$router.push({ params: { order: value } });
    }
  }
};
</script>

<style lang="scss" scoped>
.sidebar-select-order {
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
}
</style>

<template>
  <section class="rules">
    <section-header title="Rules" />
    <form>
      <form-input
        class="rules__search-input"
        type="search"
        name="find-blog"
        placeholder="Find blog"
      />
    </form>
    <div class="rules-container" v-if="rules.length">
      <article
        class="rules-article"
        v-for="(rule, index) in rules"
        :key="index"
      >
        <h3 class="rules-article__title">{{ rule.name }}</h3>
        <p class="rules-article__text">{{ rule.description }}</p>
      </article>
    </div>
  </section>
</template>

<script>
import { communityAreas } from '@/services/Community/community.service';
import FormInput from '../common/Fields/FormInput';
import SectionHeader from '../common/SectionHeader';

export default {
  name: communityAreas.rules,
  components: {
    FormInput,
    SectionHeader
  },
  props: {
    rules: {
      type: Array
    }
  },
  data() {
    return {
      data: null
    };
  }
};
</script>
<style lang="scss" scoped>
.rules {
  &-container {
    padding: var(--element-padding-xl);
    background-color: var(--BG-blog-post);
    border-radius: var(--border-radius);
  }

  &-article {
    color: var(--text-primary);
    &:not(:last-of-type) {
      margin-bottom: var(--element-margin-l);
    }

    &__title {
      font-size: var(--size-regular);
      font-family: 'OpenSans-Bold', sans-serif;
      margin-bottom: var(--element-margin-s);
    }

    &__text {
      font-size: var(--size-regular);
      margin-bottom: 0;
      line-height: 1.5em;
    }
  }

  &__search-input {
    margin-bottom: var(--element-padding-l);
  }
}

::v-deep .form-input {
  input {
    border-color: var(--border-input-search);
    background-color: var(--BG-blog-post);
  }
}
</style>

<template>
  <section class="create-rules">
    <form class="create-rules-container">
      <div
        class="create-rules__container"
        v-for="(item, index) in currentRules"
        :key="index"
      >
        <form-input
          labelText="Rule Name"
          class="create-rules__input"
          type="text"
          :id="`name-${index}`"
          name="rule-name"
          v-model="currentRules[index].name"
        />
        <form-input
          labelText="Description"
          class="create-rules__input"
          type="text"
          :id="`description-${index}`"
          name="description"
          v-model="currentRules[index].description"
        />
      </div>
      <form-button
        :plus="true"
        text="+ Add rule"
        class="create-rules__plus-btn"
        @click.native="newRule"
      />
    </form>
  </section>
</template>

<script>
import FormInput from '~common/Fields/FormInput';
import FormButton from '~common/Buttons/FormButton';
import { modelProxy } from '@/utils/proxy';

export default {
  model: {
    prop: 'rules'
  },
  components: {
    FormInput,
    FormButton
  },
  props: {
    rules: {
      type: Array,
      required: true
    }
  },
  computed: {
    currentRules() {
      return modelProxy(this, 'rules');
    }
  },
  methods: {
    newRule() {
      this.currentRules.push({
        name: '',
        description: ''
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.create-rules {
  &__plus-btn {
    margin: 0;
  }
  &-container {
    padding: var(--element-padding-xl);
    background-color: var(--BG-blog-post);
    border-radius: var(--border-radius);
  }
  &__input {
    margin-bottom: var(--element-margin-m);
  }
  &__input:nth-child(even) {
    margin-bottom: var(--element-margin-xl);
  }
}
</style>

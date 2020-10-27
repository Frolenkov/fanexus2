<template>
  <div class="edit-community">
    <form class="settings" ref="form">
      <div class="settings-container">
        <h3 class="edit-community__title">Title</h3>
        <form-input
          class="edit-community__name"
          :class="{ error: nameErrors.length }"
          type="text"
          name="Blog Name"
          placeholder="Blog name"
          v-model="currentData.name"
          @input="clearError('name')"
        />
        <span
          class="error__message"
          v-for="(nameError, index) in nameErrors"
          :key="`${index}-${nameError.message}`"
          >{{ nameError.message }}</span
        >
        <h3 class="edit-community__title">Tags</h3>
        <tag-input
          :list="currentData.Tags.map(({ name }) => name)"
          placeholder="Add tag"
          @listChange="
            currentData.Tags = $event.map(tag => ({ name: tag, id: 1 }))
          "
        />
        <h3 class="edit-community__title">Description</h3>
        <form-input
          class="edit-community__description"
          :class="{ error: descriptionErrors.length }"
          type="textarea"
          name="Blog description"
          placeholder="Blog description"
          v-model="currentData.description"
          @input="clearError('description')"
        />
        <span
          class="error__message"
          v-for="(descriptionError, index) in descriptionErrors"
          :key="`${index}-${descriptionError.message}`"
          >{{ descriptionError.message }}</span
        >
        <h3 class="edit-community__title">Url</h3>
        <form-input
          class="edit-community__url"
          :class="{ error: linkErrors.length }"
          type="text"
          name="Create link"
          placeholder="Create link"
          v-model="currentData.link"
          @input="clearError('link')"
        />
        <span
          class="error__message"
          v-for="(linkError, index) in linkErrors"
          :key="`${index}-${linkError.message}`"
          >{{ linkError.message }}</span
        >
        <h3 class="edit-community__title">Website</h3>
        <div>
          <form-input
            v-for="(input, index) in currentData.links"
            :key="index"
            class="edit-community__link"
            type="text"
            name="Paste link"
            placeholder="Paste link"
            v-model="currentData.links[index]"
          />
          <form-button
            :plus="true"
            class="edit-community__add-link"
            text="+ add website"
            @click.native.stop="addLink"
          />
        </div>
        <h3 class="edit-community__title">Rules</h3>
        <community-create-rules v-model="currentData.communityRules" />
      </div>
    </form>
  </div>
</template>

<script>
import FormInput from '~common/Fields/FormInput';
import FormButton from '~common/Buttons/FormButton';
import TagInput from '~common/Fields/TagInput';
import CommunityCreateRules from '@/components/Community/CommunityCreateRules';
import validationMixin from '@/mixins/validation.mixin';
import { modelProxy } from '@/utils/proxy';

export default {
  props: {
    data: {
      type: Object,
      required: true
    },
    errors: {
      type: Array,
      required: true
    }
  },
  model: {
    prop: 'data'
  },
  components: {
    FormInput,
    FormButton,
    TagInput,
    CommunityCreateRules
  },
  mixins: [validationMixin],
  computed: {
    currentData() {
      return modelProxy(this, 'data');
    }
  },
  methods: {
    addLink() {
      this.currentData.links.push('');
    },
    clearError(path) {
      this.$emit('clear-error', path);
    }
  }
};
</script>

<style lang="scss" scoped>
.edit-community {
  &__title {
    margin-top: var(--element-margin-m);
    color: var(--text-primary);
  }

  &__link {
    margin-bottom: var(--element-margin-m);
  }
}

.error__message {
  font-size: var(--size-small);
  color: var(--error);
  margin-bottom: var(--element-margin-m);
  &:first-letter {
    text-transform: uppercase;
  }
}
::v-deep .error {
  margin-bottom: var(--element-margin-xs);
  input,
  textarea {
    border-color: var(--border-input-error);
  }
}
</style>

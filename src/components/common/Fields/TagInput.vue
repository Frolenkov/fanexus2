<template>
  <div class="tags-input-area" @click="setToInput">
    <tags-list :list="listView" :is-input="true" @remove-tag="removeTag" />
    <div class="tags-input-area__input">
      <input
        ref="input"
        type="text"
        class="new-tag"
        :placeholder="placeholder"
        v-model="newTag"
        @focus="startInput"
        @blur="endInput"
        @keydown.enter.prevent="addTag"
      />
      <div
        class="tags-input-area__input-autocomplete"
        v-if="inputtingTags && autocompleteEntries.length"
      >
        <div
          class="tags-input-area__input-autocomplete-entry"
          v-for="autocompleteEntry of autocompleteEntries"
          :key="autocompleteEntry"
          @mousedown="setInput(autocompleteEntry)"
        >
          {{ autocompleteEntry }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getTag } from '@/services/tag.service';
import TagsList from '~common/TagsList';

export default {
  props: {
    list: {
      type: Array,
      default: () => [],
      required: true
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  components: {
    TagsList
  },
  data() {
    return {
      newTag: '',
      inputtingTags: false,
      autocompleteEntries: []
    };
  },
  computed: {
    listView() {
      return this.list.map(tag => {
        return {
          name: tag
        };
      });
    }
  },
  methods: {
    setToInput() {
      this.$refs.input.focus();
    },
    addTag() {
      if (this.newTag && !this.list.includes(this.newTag)) {
        const tagList = this.list.slice();
        tagList.push(this.newTag);
        this.newTag = '';
        this.$emit('listChange', tagList);
      }
    },
    removeTag(nameToRemove) {
      this.$emit(
        'listChange',
        this.list.filter(tagName => tagName !== nameToRemove)
      );
    },
    startInput() {
      this.inputtingTags = true;
    },
    endInput() {
      this.addTag();
      this.inputtingTags = false;
    },
    getAutocomplete(input) {
      return getTag(input).then(result => [
        ...new Set(
          result
            .filter(
              tag =>
                (tag.name.toLowerCase().includes(input.toLowerCase()) ||
                  tag.synonyms.some(synonym =>
                    synonym.toLowerCase().includes(input.toLowerCase())
                  )) &&
                !this.list.includes(tag.name)
            )
            .map(result => result.name)
        )
      ]);
    },
    setInput(input) {
      this.newTag = input;
    }
  },
  watch: {
    newTag(input) {
      if (input) {
        return this.getAutocomplete(input).then(entries => {
          this.autocompleteEntries = entries;
        });
      } else {
        return (this.autocompleteEntries = []);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.tags-input-area {
  cursor: text;
  width: 100%;
  padding: var(--element-padding-m) var(--element-padding-s);
  overflow: visible;
  border-radius: var(--border-radius);
  border: var(--border-width-thin) solid;
  border-color: var(--border-input-normal);
  background-color: var(--BG-blog-post);

  &__input {
    position: relative;
    display: inline-block;

    &-autocomplete {
      position: absolute;
      left: var(--element-padding-xs);
      top: 100%;
      border: var(--border-width-thin) solid var(--border-tag);
      padding: var(--element-padding-s);
      border-radius: var(--border-radius);
      background-color: var(--BG-dropdown);
      cursor: pointer;
      z-index: var(--z-index-1);

      &-entry {
        color: var(--text-primary);
        padding: var(--element-padding-xs);
        border-radius: var(--border-radius);

        &:hover {
          background-color: var(--BG-button-primary-hover);
          color: var(--tab-active);
        }
      }
    }
  }
}
.new-tag {
  background: transparent;
  border: none;
  padding: var(--element-padding-xs);
  color: var(--text-primary);
  font-size: var(--size-regular);

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: var(--color-main-500);
  }
}
</style>

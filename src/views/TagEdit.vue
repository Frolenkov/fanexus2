<template>
  <div class="tag-edit">
    <form class="tag-edit__form" @submit.prevent="submitTagEdit" ref="form">
      <!-- @TODO fix input borders -->
      <!-- add input labels, remove headers -->
      <show-all-button
        class="tag-edit__link-back"
        @click.native="goToTag()"
        text="Back to tag page"
      />
      <form-input
        :notBordered="true"
        class="tag-edit__input"
        labelText="Tag name"
        name="tag-name"
        placeholder="Tag name"
        v-model="tagName"
      />
      <form-input
        :notBordered="true"
        class="tag-edit__input"
        labelText="Tag Description"
        name="tag-description"
        placeholder="Tag description"
        v-model="description"
      />
      <h4 class="tag-edit__title">Parent tags:</h4>
      <tag-input
        class="tag-edit__input"
        name="parent-tags"
        placeholder="Add parent tag"
        :list="parentTagList"
        @listChange="updateList('parentTagList', $event)"
      />
      <h4 class="tag-edit__title">Child tags:</h4>
      <tag-input
        class="tag-edit__input"
        name="child-tags"
        placeholder="Add child tag"
        :list="childTagList"
        @listChange="updateList('childTagList', $event)"
      />
      <h4 class="tag-edit__title">Synonym Tags:</h4>
      <tag-input
        class="tag-edit__input"
        name="synonyms"
        placeholder="Add synonym"
        :list="synonyms"
        @listChange="updateList('synonyms', $event)"
      />
      <div class="tag-edit__buttons">
        <form-button class="tag-edit__cancel-btn" type="reset" text="Cancel" />
        <form-button class="tag-edit__save-btn" type="submit" text="Save" />
      </div>
    </form>
  </div>
</template>

<script>
import { getTag, createTag, editTag } from '@/services/tag.service';
import FormButton from '~common/Buttons/FormButton';
import FormInput from '~common/Fields/FormInput';
import TagInput from '~common/Fields/TagInput';
import ShowAllButton from '~common/Buttons/ShowAllButton';

export default {
  props: {
    name: {
      required: true,
      type: [Number, String]
    }
  },
  components: {
    FormButton,
    FormInput,
    TagInput,
    ShowAllButton
  },
  data() {
    return {
      newTag: false,
      tagName: '',
      description: '',
      parentTagList: [],
      childTagList: [],
      synonyms: []
    };
  },
  computed: {
    tagData() {
      return {
        name: this.tagName,
        description: this.description,
        parentTags: this.parentTagList,
        childTags: this.childTagList,
        synonyms: this.synonyms
      };
    }
  },
  methods: {
    updateList(list, newList) {
      this[list] = newList;
    },
    async getData() {
      try {
        const tagData = await this.getExactTag(this.name);
        if (tagData) {
          this.tagName = tagData.name;
          this.description = tagData.description;
          this.parentTagList = tagData.parentTags.map(tag => tag.name);
          this.childTagList = tagData.childTags.map(tag => tag.name);
          this.synonyms = tagData.synonyms || [];
        } else {
          this.newTag = true;
          this.tagName = this.name;
        }
      } catch (e) {
        return false;
      }
    },
    async getExactTag(tagName) {
      const matchedTags = (await getTag(tagName)).filter(
        result => result.name === tagName
      );
      if (matchedTags.length) {
        return matchedTags[0];
      }
      return false;
    },
    async createTagIfNotExist(name) {
      const tagData = await this.getExactTag(name);
      if (tagData) {
        return tagData.name;
      } else {
        const payload = [name];
        const newTag = await createTag(...payload);
        return newTag.name;
      }
    },
    async createParentAndChildTags() {
      await Promise.all(
        this.parentTagList
          .map(this.createTagIfNotExist)
          .concat(this.childTagList.map(this.createTagIfNotExist))
      );
    },
    async submitTagEdit() {
      await this.createParentAndChildTags();
      const payload = [this.name, this.tagData];
      if (this.newTag) {
        await createTag(...payload);
      } else {
        await editTag(...payload);
      }
    },
    goToTag() {
      this.$router.push({ name: 'tag-show', params: { synonym: this.name } });
    }
  },
  async mounted() {
    await this.getData();
  }
};
</script>
<style lang="scss" scoped>
/** @TODO revise styling */
.tag-edit {
  padding: var(--element-padding-xl);
  width: 100%;
  overflow-y: auto;
  grid-area: content;

  &__form {
    max-width: var(--width-large);
  }

  &__link-back {
    margin-bottom: var(--element-margin-xs);
  }

  h4 {
    color: var(--text-primary);
    margin-bottom: var(--element-margin-xs);
  }

  &__input {
    margin-bottom: var(--element-margin-l);
    display: inline-block;
    border-radius: var(--border-radius);
    width: 680px;
  }

  &__cancel-btn {
    margin-right: var(--element-margin-m);
    min-width: 90px;
  }

  &__save-btn {
    min-width: 90px;
  }

  &__buttons {
    border-top: var(--border-width-thin) solid var(--popular-blog-divider);
    padding-top: var(--element-padding-l);
  }

  &__title {
    font-size: var(--size-button);
    font-family: 'OpenSans-Bold', sans-serif;
    margin-bottom: var(--element-margin-s);
    color: var(--text-primary);
  }
}

::v-deep {
  input {
    background-color: var(--BG-blog-post);
  }

  .tags-input-area {
    border: none;
  }
}
</style>

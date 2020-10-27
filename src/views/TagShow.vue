<template>
  <article class="tag" v-if="tagsData">
    <div
      class="tag-view"
      v-for="(tagData, index) of tagsData"
      :key="`${tagData.id}-${index}`"
    >
      <section class="tag__section">
        <h4 class="tag__header">
          {{ tagData.name }}
          <form-button
            class="tag-follow-button"
            type="cancel"
            text="Unsubscribe"
            @click.native.stop="unsubscribeFromTag(tagData.id)"
            v-if="tagData.isSubscribe"
          />
          <form-button
            v-else
            class="tag-follow-button"
            type="submit"
            text="Subscribe"
            @click.native.stop="subscribeToTag(tagData.id)"
          />

          <form-button
            v-if="tagData.isBlocking"
            class="tag-follow-button"
            type="submit"
            text="Unblock"
            @click.native.stop="toggleBlockTag(tagData.id, false)"
          />
          <form-button
            v-else
            class="tag-follow-button"
            type="submit"
            text="Block"
            @click.native.stop="toggleBlockTag(tagData.id)"
          />
          <form-button
            class="tag-follow-button"
            type="button"
            text="Edit"
            @click.native.stop="goToEditTag(tagData.name)"
          />
        </h4>
        <p
          v-if="tagData.description"
          class="tag__description"
          v-html="tagData.description"
        />
        <show-all-button
          @click.native="goToTaggedBlogPosts(tagData.name)"
          :text="`Blog posts tagged ${tagData.name}`"
        />
      </section>
      <section class="tag__section" v-if="tagData.parentTags.length">
        <h4 class="tag__header">Parent Tags:</h4>
        <tags-list :list="tagData.parentTags" @click.native.stop />
      </section>
      <section class="tag__section" v-if="tagData.childTags.length">
        <h4 class="tag__header">Child Tags:</h4>
        <tags-list :list="tagData.childTags" @click.native.stop />
      </section>
      <section class="tag__section" v-if="tagData.synonymTags.length">
        <h4 class="tag__header">Synonym Tags:</h4>
        <tags-list :list="tagData.synonymTags" @click.native.stop />
      </section>
    </div>
  </article>
</template>

<script>
import FormButton from '~common/Buttons/FormButton';
import { mapState } from 'vuex';
import ShowAllButton from '~common/Buttons/ShowAllButton';
import { getTag } from '@/services/tag.service';
import {
  createFollow,
  deleteFollow,
  followableTypes,
  createBlock,
  deleteBlock
} from '@/services/follow.service';

import TagsList from '~common/TagsList';

export default {
  props: {
    synonym: {
      default: '',
      type: [Number, String]
    }
  },
  components: {
    TagsList,
    FormButton,
    ShowAllButton
  },
  data() {
    return {
      tagsData: null
    };
  },
  computed: {
    ...mapState({
      activeAliasId: state => state.alias.activeAliasId
    })
  },
  methods: {
    async subscribeToTag(id) {
      try {
        await createFollow(id, followableTypes['tag']);
        await this.getData();
      } catch (e) {
        return false;
      }
    },
    async unsubscribeFromTag(id) {
      try {
        await deleteFollow(id, followableTypes['tag']);
        await this.getData();
      } catch (e) {
        return false;
      }
    },
    async toggleBlockTag(id, isCreateBlock = true) {
      const action = isCreateBlock ? createBlock : deleteBlock;

      try {
        await action(id, followableTypes['tag'], {
          alias: this.activeAliasId
        });
        await this.getData();
      } catch (e) {
        return false;
      }
    },
    goToTaggedBlogPosts(name) {
      this.$router.push({
        name: 'tagged-blog-posts',
        params: { tagNames: JSON.stringify([name]) }
      });
    },
    getData() {
      try {
        return getTag(this.synonym).then(tags => {
          return (this.tagsData = tags.map(tag => {
            return {
              id: tag.id,
              name: tag.name,
              description: tag.description,
              isSubscribe: tag.aliasFollowing,
              isBlocking: tag.aliasBlocking,
              parentTags: tag.parentTags,
              childTags: tag.childTags,
              synonymTags: tag.synonyms
                ? tag.synonyms.map(synonym => {
                    return { id: tag.id, name: synonym };
                  })
                : []
            };
          }));
        });
      } catch (e) {
        return false;
      }
    },
    goToEditTag(tagName) {
      this.$router.push({ name: 'tag-edit', params: { name: tagName } });
    }
  },
  async mounted() {
    await this.getData();
  }
};
</script>
<style lang="scss" scoped>
.tag {
  overflow-y: auto;
  grid-area: content;
  width: 100%;
  padding: var(--element-padding-s);

  &-follow-button {
    margin-left: var(--element-margin-m);
  }

  &-view {
    padding: var(--element-padding-m);
    border: var(--border-width-default) solid var(--border-block);

    &:not(:first-child) {
      margin-top: var(--element-margin-s);
    }
  }

  &__section {
    color: var(--text-primary);
    border-bottom: var(--border-width-thin) solid var(--divider-in-popup);

    &:not(:first-child) {
      margin-top: var(--element-margin-m);
      padding-top: var(--element-margin-m);
    }

    &:last-child {
      border: none;
    }
  }
  &__header {
    font-size: var(--size-regular);
    font-family: 'OpenSans-Bold', sans-serif;
    margin-bottom: var(--element-margin-s);
    color: var(--text-primary);
  }
  &__description {
    font-size: var(--size-regular);
    margin-bottom: 0;
    line-height: 1.5em;
    color: var(--text-primary);
  }
}
</style>

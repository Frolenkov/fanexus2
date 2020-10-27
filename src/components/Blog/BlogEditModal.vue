<template>
  <div class="edit-blog" v-if="data">
    <modal
      class="edit-blog-modal modal-overlay--centered"
      :settings="settings"
      @save="handleSave"
      :closeOnSave="false"
    >
      <template slot="body">
        <add-image
          :type="blogImageTypes.coverImage"
          class="edit-blog__add-bg"
          button-text="Change Background"
          @add="handleAddImage"
        >
          <wallpaper :src="coverImageData" />
        </add-image>
        <div class="edit-blog__header">
          <div class="edit-blog__header-wrapper">
            <add-image
              :type="blogImageTypes.avatar"
              class="edit-blog__header-add-img"
              @add="handleAddImage"
              button-text="Change Image"
            >
              <avatar
                class="blog-header__avatar"
                size="xl"
                :file="avatarImageData"
              />
            </add-image>
          </div>
        </div>
        <div class="edit-blog__content">
          <form class="settings" ref="form">
            <div class="settings-container">
              <h3 class="edit-blog__title">Title</h3>
              <form-input
                class="edit-blog__title"
                :class="{ error: nameErrors.length }"
                type="text"
                name="Blog Name"
                placeholder="Blog name"
                v-model="data.name"
                @input="clearError('name')"
              />
              <span
                class="error__message"
                v-for="(nameError, index) in nameErrors"
                :key="`${index}-${nameError.message}`"
                >{{ nameError.message }}</span
              >
              <h3 class="edit-blog__title">Tags</h3>
              <tag-input
                :list="data.Tags.map(({ name }) => name)"
                placeholder="Add tag"
                @listChange="
                  data.Tags = $event.map(tag => ({ name: tag, id: 1 }))
                "
              />
              <h3 class="edit-blog__title">Description</h3>
              <form-input
                class="edit-blog__description"
                :class="{ error: descriptionErrors.length }"
                type="textarea"
                name="Blog description"
                placeholder="Blog description"
                v-model="data.description"
                @input="clearError('description')"
              />
              <span
                class="error__message"
                v-for="(descriptionError, index) in descriptionErrors"
                :key="`${index}-${descriptionError.message}`"
                >{{ descriptionError.message }}</span
              >
              <h3 class="edit-blog__title">Url</h3>
              <form-input
                class="edit-blog__url"
                :class="{ error: linkErrors.length }"
                type="text"
                name="Create link"
                placeholder="Create link"
                v-model="data.link"
                @input="clearError('link')"
              />
              <span
                class="error__message"
                v-for="(linkError, index) in linkErrors"
                :key="`${index}-${linkError.message}`"
                >{{ linkError.message }}</span
              >
              <h3 class="edit-blog__title">Website</h3>
              <div>
                <form-input
                  v-for="(input, index) in data.links"
                  :key="index"
                  class="edit-blog__link"
                  type="text"
                  name="Paste link"
                  placeholder="Paste link"
                  v-model="data.links[index]"
                />
                <form-button
                  :plus="true"
                  class="edit-blog__add-link"
                  text="+ add link"
                  @click.native.stop="addLink"
                />
              </div>
            </div>
          </form>
        </div>
      </template>
    </modal>
  </div>
</template>

<script>
import FormButton from '~common/Buttons/FormButton';
import FormInput from '~common/Fields/FormInput';
import { mapState, mapActions } from 'vuex';
import { feedTypes } from '@/services/feed.service';
import { getBlogData } from '@/services/Blog/blog.service';
import Modal from '~common/Modal';
import AddImage from '~common/AddImage';
import { blogImageTypes, editBlog } from '@/services/Blog/blog.service';
import Wallpaper from '~common/Wallpaper';
import Avatar from '~common/Avatar';
import TagInput from '~common/Fields/TagInput';
import validationMixin from '@/mixins/validation.mixin';

export default {
  components: {
    AddImage,
    Wallpaper,
    Avatar,
    FormButton,
    FormInput,
    Modal,
    TagInput
  },
  props: {
    name: {
      type: [Number, String],
      required: true
    },
    settings: {
      type: Object,
      required: true
    }
  },
  mixins: [validationMixin],
  data() {
    return {
      blogImageTypes,
      feedTypes,
      errors: [],
      activeTab: 0,
      data: null
    };
  },
  computed: {
    ...mapState({
      activeAliasId: state => state.alias.activeAliasId,
      list: state => state.tags.list
    }),
    /** @TODO make it common between blog and community */
    coverImageData() {
      if (!this.data || !this.data.coverImage) return '';

      return this.data.coverImage.accessUrl || this.data.coverImage.src;
    },
    /** @TODO make it common between blog and community */
    avatarImageData() {
      if (!this.data || !this.data.avatar) return '';

      return this.data.avatar.accessUrl || this.data.avatar.src;
    },
    /** @TODO make it common between blog and community */
    tagItems() {
      return this.tags.map(tag => ({ name: tag, id: 0 }));
    }
  },
  methods: {
    addLink() {
      this.data.links.push('');
    },
    goBack() {
      this.$router.go(-1);
    },
    handleAddImage({ type, data }) {
      this.data[type] = { ...data };
    },
    async handleSave() {
      const { name, link, links, description, avatar, coverImage } = this.data;
      const payload = {
        alias: this.activeAliasId,
        name,
        link,
        links,
        description,
        tagNames: this.data.Tags.map(({ name }) => name)
      };

      /** @TODO make it common between blog and community */
      payload.links = payload.links.filter(link => link.length);

      /** @TODO make it common between blog and community */
      if (coverImage.accessUrl) {
        payload.coverImage = coverImage;
      }
      if (avatar.accessUrl) {
        payload.avatar = avatar;
      }

      try {
        await editBlog(this.data.id, payload);
        await this.getFeedData({
          name: link || this.data.id,
          pagination: 1,
          type: feedTypes.blog
        });
        await this.getUserAliases();
        this.$router.push({
          name: 'blog',
          params: {
            name: link || this.data.id
          }
        });
      } catch (e) {
        this.errors = e.response.data.errors;
      }
    },
    ...mapActions(['getFeedData', 'getUserAliases'])
  },
  async mounted() {
    this.data = await getBlogData({
      name: this.name,
      pagination: 1
    });
  }
};
</script>

<style lang="scss" scoped>
.edit-blog {
  grid-area: content;
  overflow: auto;
  background-color: var(--BG-primary);

  &__header {
    display: grid;
    align-items: end;
    grid-template-rows: minmax(0, 60px);
    grid-template-columns:
      var(--width-very-small)
      max-content var(--width-small);
    grid-gap: var(--element-margin-xl);
    background-color: var(--BG-blog-post);
    padding: 0 var(--element-padding-xl);
    margin-bottom: var(--element-margin-xl);

    &-wrapper {
      border: var(--border-width-avatar) solid var(--color-white);
      height: 120px;
      z-index: 1;
      border-radius: var(--border-radius);
    }

    &-add-img {
      height: 100%;

      ::v-deep .xl {
        border-radius: 0;
        height: 100%;
      }
    }
  }

  &__content {
    padding: 0 var(--element-padding-xl);
  }

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

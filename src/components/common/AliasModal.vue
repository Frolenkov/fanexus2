<template>
  <modal
    @save="sendData"
    @close="$emit('close')"
    :settings="settings"
    class="alias-popup modal-overlay--centered"
  >
    <template slot="body">
      <div class="alias-popup__container">
        <p class="alias-popup__text">
          {{ data.text }}
        </p>
        <form action="">
          <form-input
            labelText="Alias Name"
            class="alias-popup__name"
            type="text"
            placeholder="Alias name"
            name="Alias-name"
            v-model="data.aliasName"
          />
          <div class="alias-popup__new-group">
            <form-input
              labelText="Add an image for your new alias"
              class="alias-popup__new-group-name"
              type="text"
              name="new-alias-name"
              v-model="data.accessUrl"
              placeholder="imagename.jpg"
            />
            <form-button
              type="button"
              class="alias-popup__new-group-button button--submit"
              text="Upload New"
              @click.native="$refs.fileInput.click()"
            />
            <input
              v-show="false"
              ref="fileInput"
              type="file"
              class="alias-popup__file-input"
              name="upload-new"
              accept="image/*"
              @change="onFileChoose"
            />
          </div>
        </form>
      </div>
    </template>
  </modal>
</template>
<script>
import { mapActions } from 'vuex';
import FormButton from '../common/Buttons/FormButton';
import FormInput from '../common/Fields/FormInput';
import Modal from '../common/Modal';
import { createFormData, imageUpload } from '@/services/image.service';
import { createNewAlias } from '@/services/alias.service';

export default {
  components: {
    FormButton,
    FormInput,
    Modal
  },
  props: {
    data: {
      type: Object,
      required: true
    },
    settings: {
      type: Object,
      required: true
    }
  },
  methods: {
    ...mapActions(['getUserAliases']),
    async onFileChoose(event) {
      const { accessUrl, baseUrl, imageIdentifier } = await imageUpload(
        createFormData(event)
      );
      this.data.accessUrl = accessUrl;
      this.data.baseUrl = baseUrl;
      this.data.imageIdentifier = imageIdentifier;

      this.$refs.fileInput.value = '';
    },
    async sendData() {
      const {
        aliasName: name,
        accessUrl,
        baseUrl,
        imageIdentifier: identifier
      } = this.data;

      await createNewAlias({
        name,
        avatar: {
          name,
          src: baseUrl || accessUrl,
          alt: name,
          identifier
        }
      });
      await this.getUserAliases();
    }
  }
};
</script>

<style lang="scss" scoped>
.alias-popup {
  &__container {
    padding: var(--element-padding-xl) var(--element-margin-l) 0;
  }

  &__name {
    margin-bottom: var(--element-margin-xl);
  }

  &__new-group {
    display: flex;
    align-items: flex-end;
    padding-bottom: var(--element-margin-xl);

    &-name {
      flex: 1 0 0;
      margin-right: var(--element-margin-s);
    }

    &-button {
      height: 41px;
    }
  }
  &__text {
    color: var(--text-primary);
    margin-bottom: var(--element-margin-xl);
    font-size: var(--size-regular);
    line-height: var(--size-title);
  }
}

::v-deep {
  .modal {
    margin: 0 auto;
    width: 580px;
    .modal-body {
      padding: 0;
    }
    &-content {
      margin: 0;
    }
  }
  label {
    font-size: var(--size-regular);
  }
  .modal-header,
  .modal-footer {
    background-color: var(--BG-create-post-modal-body);
  }

  .modal-body {
    background-color: var(--BG-create-post-modal);
  }

  .button--submit {
    background-color: var(--BG-button-secondary);
    color: var(--text-button-secondary);
    &:focus,
    &:hover {
      background-color: var(--BG-button-secondary-hover);
      border-color: var(--border-button-secondary-hover);
      color: var(--text-button-comment);
    }
    &.button--disabled,
    &.button--disabled:hover {
      cursor: not-allowed;
      background-color: var(--BG-button-secondary-disabled);
      border-color: var(--border-button-secondary-disabled);
      color: var(--text-button-comment);
    }
  }
}
</style>

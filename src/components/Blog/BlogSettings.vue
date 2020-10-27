<template>
  <form class="settings" @submit.prevent="submitBlogEdit" ref="form">
    <div class="settings-container" v-if="data">
      <div
        v-for="([key, { title, data: settingsData, id }],
        index) in Object.entries(settings)"
        :key="`${title}-${index}`"
        class="radio-button-group"
      >
        <h4 class="radio-button-group__title">{{ title }}</h4>

        <template v-for="(dataItem, index) in settingsData">
          <!-- @TODO test value change -->
          <form-toggler
            class="form-toggler"
            v-if="id === 'visibility'"
            v-model="data[dataItem.name]"
            :key="`${id}-${index}`"
            :name="dataItem.name"
            context="settings"
            v-slot:after
          >
            {{ dataItem.text }}
          </form-toggler>
          <form-radio-button
            v-else
            :name="key"
            :value="dataItem.value"
            :key="`${id}-${index}`"
            v-model="data[id].accessControlSetting"
          >
            {{ dataItem.text }}
          </form-radio-button>
          <!-- @TODO output select only if button checked -->
          <form-select
            :key="`${id}-${index}-select`"
            v-if="dataItem.selectOptions"
            title="security group name"
            :options="dataItem.selectOptions"
            name="security-groups"
          />
        </template>
      </div>
      <div class="settings__buttons">
        <form-button class="settings__cancel-btn" type="reset" text="Cancel" />
        <form-button
          class="settings__save-btn"
          type="submit"
          text="Save"
          :disabled="disabled"
        />
      </div>
    </div>
  </form>
</template>

<script>
import { mapState } from 'vuex';
import { feedTypes } from '@/services/feed.service';
import { getBlogData } from '@/services/Blog/blog.service';
import FormButton from '~common/Buttons/FormButton';
import FormRadioButton from '@/components/common/Fields/FormRadioButton';
import FormSelect from '@/components/common/Fields/FormSelect';
import FormToggler from '~common/Fields/FormToggler';
import settings from '@/services/Blog/blog.settings';
import { editBlog } from '@/services/Blog/blog.service';
import { updateAlias } from '@/services/alias.service';

export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  components: {
    FormButton,
    FormSelect,
    FormToggler,
    FormRadioButton
  },
  data() {
    return {
      settings,
      feedTypes,
      data: null
    };
  },
  computed: {
    ...mapState({
      activeAliasId: state => state.alias.activeAliasId,
      activeAliasBlogId: state => state.alias.activeAliasBlog.id,
      activeAliasData: state => state.alias.activeAliasData,
      showMinors: state => state.alias.activeAliasData.showMinors,
      hideFromSearch: state => state.alias.activeAliasData.hideFromSearchResults
    })
  },
  methods: {
    async submitBlogEdit() {
      const blogPayload = (({
        contentAccessControl,
        followsAccessControl,
        commentsAccessControl,
        reactionsAccessControl
      }) => ({
        alias: this.activeAliasId,
        contentAccessControl,
        followsAccessControl,
        commentsAccessControl,
        reactionsAccessControl
      }))(this.data);
      const aliasPayload = (({ hideFromMinors, hideFromSearch }) => ({
        ...this.activeAliasData,
        showMinors: !hideFromMinors,
        hideFromSearchResults: hideFromSearch
      }))(this.data);

      try {
        await Promise.all([
          editBlog(this.data.id, blogPayload),
          updateAlias(aliasPayload)
        ]);
        this.$emit('success');
      } catch (e) {
        this.error = e.response.data.errors;
      }
    }
  },
  watch: {
    activeAliasBlogId: {
      handler: async function(id) {
        if (id) {
          this.data = {
            ...(await getBlogData({
              name: this.activeAliasBlogId,
              pagination: 1,
              type: feedTypes.blog
            })),
            hideFromMinors: !this.showMinors,
            hideFromSearch: this.hideFromSearch
          };
        }
      },
      immediate: true
    }
  }
};
</script>
<style lang="scss" scoped>
.settings {
  margin-bottom: var(--element-margin-xxl);
  &-container {
    background-color: var(--BG-blog-post);
    border-radius: var(--border-radius);
    padding: var(--element-padding-xl);
  }

  &__cancel-btn {
    margin-right: var(--element-margin-m);
    min-width: 90px;
  }

  &__save-btn {
    min-width: 90px;
  }
}

::v-deep {
  .radio-button-group {
    margin-bottom: var(--element-margin-l);
    font-size: var(--size-regular);
    h4 {
      font-family: 'OpenSans-Bold', sans-serif;
      color: var(--text-primary);
      margin-bottom: var(--element-margin-m);
    }
    /** @TODO revise */
    .radiobutton:last-child {
      margin-bottom: var(--element-margin-l);
    }
  }

  .select {
    margin-left: var(--element-margin-xl);
    font-size: var(--size-regular);
    &__toggler {
      padding: var(--button-padding-s) var(--element-padding-s);
    }
  }
  .checkbox__text {
    font-size: var(--size-regular);
  }

  .toggler-settings {
    margin-bottom: var(--element-margin-m);
  }
}
</style>

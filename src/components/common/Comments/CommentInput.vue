<!-- @TODO revise if we can include this component in the parent as it is -->
<template>
  <div class="comments-input">
    <form-rich-text-editor
      ref="richTextEditor"
      :value="newComment"
      @input="comment => $emit('input', comment)"
      @submit="sendComment"
    >
      <button
        type="button"
        @click="sendComment"
        class="comments-input-textarea__submit"
      >
        {{ editing ? 'Update' : 'Comment' }}
      </button>
    </form-rich-text-editor>
  </div>
</template>

<script>
import FormRichTextEditor from '~fields/FormRichTextEditor';

export default {
  components: {
    FormRichTextEditor
  },
  props: {
    newComment: {
      type: String
    },
    editing: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    newComment: {
      handler(n) {
        if (n === '') {
          this.$refs.richTextEditor.setInnerHtml(n);
        }
      }
    }
  },
  methods: {
    sendComment() {
      this.$emit('createComment');
    }
  }
};
</script>

<style lang="scss" scoped>
.comments-input {
  &-textarea__submit {
    height: 50px;
    background-color: var(--BG-button-comment);
    padding: 0 var(--element-padding-l);
    border-radius: var(--border-radius);
    color: var(--text-button-comment);
    font-family: 'OpenSans-Bold';
    font-size: var(--size-button);
    text-transform: capitalize;
    margin-left: var(--element-margin-s);
    min-width: 100px;
    &:focus {
      outline: none;
      color: var(--text-button-hover);
    }
  }
}
</style>

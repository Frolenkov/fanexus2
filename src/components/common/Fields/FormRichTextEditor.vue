<template>
  <div class="rich-text-editor">
    <ul class="rich-text-editor__social-links active">
      <li v-for="a in mediaActions" :key="a.id">
        <template v-if="a.type === actions.uploadImage">
          <!-- @TODO provide only $event to the handleExecCommand method -->
          <label>
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              v-show="false"
              @change="$event => handleExecCommand(a.type, $event)"
            />
            <component :is="a.icon" />
          </label>
        </template>
        <button type="button" v-else @click="() => handleExecCommand(a.type)">
          <component :is="a.icon" />
        </button>
      </li>
    </ul>
    <!-- @TODO add proper condition on v-if -->
    <div v-if="false" class="rich-text-editor__image">
      <!-- @TODO make it dynamic -->
      <!-- @TODO remove height -->
      <img
        height="4"
        src="https://i.pinimg.com/originals/2b/52/7d/2b527dfbe670cd5a746425eb30e2740d.jpg"
        alt="downloaded-image"
      />
      <button type="button" class="rich-text-editor__delete-btn">
        Delete image
      </button>
    </div>
    <ul class="rich-text-editor__tools active">
      <li class="rich-text-editor__item" v-for="c in commands" :key="c.id">
        <button type="button" @click.stop="() => handleExecCommand(c.type)">
          <component :is="c.icon" />
        </button>
      </li>
    </ul>
    <div class="textarea-container">
      <div
        ref="editorArea"
        contenteditable
        class="textarea"
        data-placeholder="Type your comment here"
        @input="handleInput"
        @keydown.ctrl.enter="$emit('submit')"
      >
        {{ value }}
      </div>
      <slot />
    </div>
  </div>
</template>

<script>
import {
  commands,
  mediaActions,
  getQueryCommandState,
  execCommand,
  actions
} from '@/services/rich-text-editor.service';
// media
import LinkIcon from '~svg/media/link.svg';
import ImageIcon from '~svg/media/image.svg';
// commands
import Bold from '~svg/text-editing/bold.svg';
import InsertUnorderedList from '~svg/text-editing/insertUnorderedList.svg';
import FormatBlockH1 from '~svg/text-editing/formatBlockH1.svg';
import FormatBlockH2 from '~svg/text-editing/formatBlockH2.svg';
import Italic from '~svg/text-editing/italic.svg';
import InsertOrderedList from '~svg/text-editing/insertOrderedList.svg';
import Sentencecase from '~svg/text-editing/sentencecase.svg';
import StrikeThrough from '~svg/text-editing/strikeThrough.svg';
import Subscript from '~svg/text-editing/subscript.svg';
import Superscript from '~svg/text-editing/superscript.svg';
import Underline from '~svg/text-editing/underline.svg';
import Quote from '~svg/text-editing/quote.svg';

export default {
  components: {
    LinkIcon,
    ImageIcon,
    Bold,
    InsertUnorderedList,
    FormatBlockH1,
    FormatBlockH2,
    Italic,
    InsertOrderedList,
    Sentencecase,
    StrikeThrough,
    Subscript,
    Superscript,
    Underline,
    Quote
  },
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      formatBlock: 'p',
      commands,
      mediaActions,
      actions
    };
  },
  methods: {
    handleInput(e) {
      this.$emit('input', e.target.innerHTML);
    },
    setInnerHtml(html) {
      this.$refs.editorArea.innerHTML = html;
    },
    imageUploadCallback(img) {
      this.$refs.editorArea.appendChild(img);
      this.$emit('input', this.$refs.editorArea.innerHTML);
      this.$refs.fileInput[0].value = '';
    },
    async handleExecCommand(type, event) {
      /** @TODO revise params, use object instead of array */
      let params = [type, false, '', null, null, this.formatBlock];

      switch (type) {
        case actions.uploadImage:
          params = [
            type,
            false,
            '',
            this.$refs.editorArea,
            event,
            this.formatBlock,
            this.imageUploadCallback
          ];
          break;
        case actions.formatBlockH1:
          this.formatBlock = this.findFormatBlock('h1') ? 'p' : 'h1';
          params = [type, false, '', null, null, this.formatBlock];
          break;
        case actions.formatBlockH2:
          this.formatBlock = this.findFormatBlock('h2') ? 'p' : 'h2';
          params = [type, false, '', null, null, this.formatBlock];
          break;
        case actions.formatBlockquote:
          (block => {
            this.formatBlock = block ? 'p' : 'blockquote';
            if (block) {
              block.replaceWith(...block.childNodes);
            }
          })(this.findFormatBlock('blockquote'));
          params = [type, false, '', null, null, this.formatBlock];
          break;
      }

      execCommand(...params);
    },
    findFormatBlock(elementType) {
      return window
        .getSelection()
        .anchorNode.parentNode.closest(
          `div[contenteditable~="true"] ${elementType}`
        );
    },
    getQueryCommandState
  },
  mounted() {
    /** @TODO revise value/v-model functionality */
    this.setInnerHtml(this.value);
  }
};
</script>

<style lang="scss" scoped>
.textarea {
  height: auto;
  flex-grow: 1;
  min-height: 50px;
  // @TODO revise do we need max-height?
  max-height: 350px;
  line-height: normal;
  border: 1px solid var(--border-input-comment-normal);
  font-size: var(--size-regular);
  padding: var(--element-padding-m) var(--element-padding-s);
  border-radius: var(--border-radius);
  background-color: transparent;
  margin-bottom: var(--element-margin-l);
  color: var(--text-primary);
  word-break: break-all;
  overflow: auto;
  resize: vertical;
  ::v-deep a {
    color: var(--text-primary);
  }

  ::v-deep {
    a {
      color: var(--text-primary);
    }

    ul {
      padding-left: 40px;
    }

    p {
      margin-bottom: 0;
    }

    blockquote {
      padding-left: var(--element-padding-s);
      border-left: var(--border-width-default) solid var(--border-group-normal);
    }
  }

  &:focus {
    outline: none;
  }

  &-container {
    display: flex;
    h1 {
      font-size: var(--comment-h1);
    }
    h2 {
      font-size: var(--comment-h2);
    }
  }

  &:empty {
    &:before {
      content: attr(data-placeholder);
    }
  }

  &:focus:before {
    display: none;
  }
}

.rich-text-editor {
  display: flex;
  flex-direction: column;
  flex: 1 0 0;
  &__delete-btn {
    background-color: var(--color-main-800);
    color: var(--color-white);
    padding: var(--element-padding-s) var(--element-padding-l);
    font-size: var(--size-regular);
    position: absolute;
    bottom: 0;
    right: 0;
    border-radius: var(--border-radius);
    cursor: pointer;
    &:focus {
      outline: none;
    }
  }

  &__image {
    margin-bottom: var(--element-margin-m);
    position: relative;

    img {
      display: block;
      opacity: var(--opacity-image-overlay);
    }
  }

  ::v-deep &__tools {
    margin: 0;
    display: none;
    margin-bottom: var(--element-margin-s);
    list-style: none;
    justify-content: space-between;
    max-width: 390px;
    flex-wrap: wrap;
    &.active {
      display: flex;
    }
    button {
      background-color: transparent;
      color: var(--border-button-tools);
      vertical-align: middle;
      &:focus {
        outline: none;
        svg {
          fill: var(--color-main-600);
        }
      }

      svg {
        fill: var(--text-activity-name-active);
        vertical-align: baseline;
      }
    }
  }
  ::v-deep &__item {
    height: 24px;
    flex-grow: 1;
    border: var(--border-width-thin) solid var(--border-button-tools);
    border-left: none;
    text-align: center;
    transition: var(--default-transition);

    button {
      width: 100%;
      height: 100%;
    }

    &:first-child {
      border-left: var(--border-width-thin) solid var(--border-button-tools);
      border-top-left-radius: var(--border-radius);
      border-bottom-left-radius: var(--border-radius);
    }

    &:last-child {
      border-top-right-radius: var(--border-radius);
      border-bottom-right-radius: var(--border-radius);
    }

    &.active {
      background-color: green;
    }
  }

  &__social-links {
    display: none;
    list-style: none;
    margin: var(--element-margin-m) 0 var(--element-margin-s);

    &.active {
      display: flex;
    }
    button,
    label {
      padding: 0 var(--button-padding-s);
      background-color: transparent;
      &:focus {
        outline: none;
        svg {
          fill: var(--color-main-500);
        }
      }

      svg {
        fill: var(--text-primary);
      }
    }
  }
}
</style>

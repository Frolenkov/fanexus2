<template>
  <div class="pagination">
    <button
      class="pagination__arrow--prev"
      type="button"
      @click="onClickPreviousPage"
      :disabled="isFirstPage"
      aria-label="Go to previous page"
    ></button>
    <ul class="pagination__buttons">
      <li
        class="pagination__button"
        v-if="currentPage > changeMaxVisibleButtonsNext"
      >
        <button
          class="pagination__button-page"
          type="button"
          @click="onClickFirstPage"
          :disabled="isFirstPage"
          aria-label="Go to first page"
        >
          1
        </button>
      </li>
      <li
        class="pagination__button"
        v-if="currentPage > changeMaxVisibleButtonPage"
      >
        <button class="pagination__button-page button-dots" type="button">
          ...
        </button>
      </li>
      <li
        v-for="({ number, isDisabled }, index) in pages"
        :key="index"
        class="pagination__button"
      >
        <button
          class="pagination__button-page"
          type="button"
          @click="onClickPage(number)"
          :disabled="isDisabled"
          :class="{ active: currentPage === number }"
          :aria-label="`Go to page number ${number}`"
        >
          {{ number }}
        </button>
      </li>
      <li class="pagination__button">
        <button class="pagination__button-page button-dots" type="button">
          ...
        </button>
      </li>
    </ul>
    <button
      class="pagination__arrow--next"
      type="button"
      @click="onClickNextPage"
      aria-label="Go to next page"
    ></button>
  </div>
</template>

<script>
let maxVisibleButtons = 9;

export default {
  props: {
    currentPage: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      changeMaxVisibleButtonsNext: 4,
      changeMaxVisibleButtonPage: 5,
      changeMaxVisibleButtonsPrevious: 6,
      startPageLimit: 3
    };
  },
  computed: {
    startPage() {
      if (this.currentPage < this.changeMaxVisibleButtonsNext) {
        return 1;
      }
      return this.currentPage - this.startPageLimit;
    },
    endPage() {
      return this.startPage + maxVisibleButtons - 1;
    },
    pages() {
      const range = [];

      for (let i = this.startPage; i <= this.endPage; i++) {
        range.push({
          number: i,
          isDisabled: i === this.currentPage
        });
      }

      return range;
    },
    isFirstPage() {
      return this.currentPage === 1;
    }
  },
  methods: {
    onClickFirstPage() {
      this.$emit('pageChanged', 1);
    },
    onClickPreviousPage() {
      this.$emit('pageChanged', this.currentPage - 1);
      if (this.currentPage === this.changeMaxVisibleButtonsPrevious) {
        maxVisibleButtons = 8;
      } else if (this.currentPage < this.changeMaxVisibleButtonsPrevious) {
        maxVisibleButtons = 9;
      }
    },
    onClickPage(page) {
      this.$emit('pageChanged', page);
      if (page === this.changeMaxVisibleButtonPage) {
        maxVisibleButtons = 8;
      } else if (page > this.changeMaxVisibleButtonPage) {
        maxVisibleButtons = 7;
      } else {
        maxVisibleButtons = 9;
      }
    },
    onClickNextPage() {
      this.$emit('pageChanged', this.currentPage + 1);
      if (this.currentPage === this.changeMaxVisibleButtonsNext) {
        maxVisibleButtons = 8;
      } else if (this.currentPage > this.changeMaxVisibleButtonsNext) {
        maxVisibleButtons = 7;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.pagination {
  display: flex;
  padding: var(--element-padding-l) 0;
  margin: 0 auto;
  justify-content: space-between;
  align-items: center;
  max-width: var(--width-large);

  &__arrow--prev,
  &__arrow--next,
  &__button-page {
    height: 30px;
    color: var(--text-primary);
    border-radius: var(--border-radius);
    background-color: transparent;
    border: var(--border-width-thin) solid var(--text-primary);
    padding: 0 var(--element-padding-s);
    text-decoration: none;
    display: flex;
    align-items: center;
    transition: var(--transition-default);
    position: relative;
    font-size: var(--size-regular);
    outline: none;
  }

  &__buttons {
    display: flex;
    justify-content: space-between;
    list-style: none;
    margin: 0;
  }
  &__button {
    margin-right: var(--element-margin-s);
    &:last-child {
      margin-right: 0;
    }
    .button-dots {
      cursor: text;
    }
  }

  &__button-page {
    &:hover {
      color: var(--BG-button-pagination-active);
      border-color: var(--BG-button-pagination-active);
    }
    &.active {
      color: var(--text-button-comment);
      border-color: transparent;
      background-color: var(--BG-button-pagination-active);
    }
  }

  &__arrow--prev:before,
  &__arrow--next:before {
    content: '';
    border-top: var(--border-width-default) solid var(--text-primary);
    border-left: var(--border-width-default) solid var(--text-primary);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%), rotate(45deg);
    width: 7px;
    height: 7px;
  }

  &__arrow--next:before {
    transform: translate(-60%, -50%) rotate(135deg);
  }

  &__arrow--prev:before {
    transform: translate(-40%, -50%) rotate(-45deg);
  }

  &__arrow--prev,
  &__arrow--next {
    width: 30px;
    background-color: transparent;
    &:focus {
      outline: none;
    }

    &:hover {
      background-color: transparent;
      border-color: var(--BG-button-pagination-active);

      &:before {
        border-color: var(--BG-button-pagination-active);
      }
    }
    &:disabled {
      border-color: var(--border-button-disabled);

      &:before {
        border-color: var(--border-button-disabled);
      }
    }
  }
}
</style>

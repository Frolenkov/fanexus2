<template>
  <section class="manage-tags">
    <article class="manage-tags-article">
      <h3 class="manage-tags__title">Searched Tag</h3>
      <p class="manage-tags__text">
        There are many variations of passages of Lorem Ipsum available, but the
        majority have suffered alteration in some form, by injected humour, or
        randomized words which don’t look even slightly believable. If you are
        going to use a passage of Lorem Ipsum, you need to be sure there isn’t
        anything embarrassing hidden in the middle of text. All the Lorem Ipsum
        generators on the Internet tend to repeat predefined chunks as
        necessary, making this the first true generator on the Internet. It uses
        a dictionary of over 200 Latin words, combined with a handful of model
        sentence structures, to generate Lorem Ipsum which looks reasonable. The
        generated Lorem Ipsum is therefore always free from repetition, injected
        humour, or non-characteristic words etc.
      </p>
    </article>
    <article class="manage-tags-article">
      <h3 class="manage-tags__title">Section</h3>
      <tags-list :list="createPostSettings.tags" :showAllBtn="true" />
    </article>
    <article class="manage-tags-article">
      <h3 class="manage-tags__title">Section</h3>
      <tags-list :list="createPostSettings.tags" :isSeparate="true" />
    </article>
    <article class="manage-tags-article">
      <h3 class="manage-tags__title">Section</h3>
      <tags-list :list="createPostSettings.tags" :isSeparate="true" />
    </article>
    <article class="manage-tags-article">
      <h3 class="manage-tags__title">Section</h3>
      <tags-list :list="createPostSettings.tags" :showAllBtn="true" />
    </article>
  </section>
</template>

<script>
import TagsList from '~common/TagsList';

export default {
  components: {
    TagsList
  },
  data() {
    return {
      createPostSettings: {
        tags: [
          {
            id: 5202200931223649,
            name: 'batman'
          },
          {
            id: 139573284492231,
            name: 'gotham'
          },
          {
            id: 139573284492232,
            name: 'gotham'
          },
          {
            id: 139573284492233,
            name: 'gotham'
          },
          {
            id: 139573284492234,
            name: 'gotham'
          },
          {
            id: 139573284492235,
            name: 'gotham'
          },
          {
            id: 5202250931223649,
            name: 'batman'
          },
          {
            id: 5202200881223649,
            name: 'batman'
          },
          {
            id: 5202200923223649,
            name: 'batman'
          },
          {
            id: 5202200231223649,
            name: 'batman'
          },
          {
            id: 520220093125553649,
            name: 'batman'
          },
          {
            id: 52022086231223649,
            name: 'batman'
          },
          {
            id: 5202228931223649,
            name: 'batman'
          },
          {
            id: 520220088831223649,
            name: 'batman'
          },
          {
            id: 520220093188223649,
            name: 'batman'
          }
        ]
      }
    };
  }
};
</script>
<style lang="scss" scoped>
.manage-tags {
  padding: var(--element-padding-xl);

  &-article {
    padding-bottom: var(--element-margin-m);
    color: var(--text-primary);
    border-bottom: var(--border-width-thin) solid var(--divider-in-popup);
    margin-bottom: var(--element-margin-m);

    &:last-child {
      border: none;
    }
  }
  &__title {
    font-size: var(--size-regular);
    font-family: 'OpenSans-Bold', sans-serif;
    margin-bottom: var(--element-margin-s);
  }
  &__text {
    font-size: var(--size-regular);
    margin-bottom: 0;
    line-height: 1.5em;
  }
}
</style>

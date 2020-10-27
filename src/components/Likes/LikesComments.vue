<template>
  <section class="likes-comments" v-if="loaded">
    <comment
      :key="`${id}-${index}`"
      v-for="({ id, showComment }, index) in data.BlogPosts"
      :comment="showComment"
      :blogPostId="id"
      :standalone="true"
    />
  </section>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { feedTypes } from '@/services/feed.service';
import Comment from '@/components/common/Comments/Comment';

export default {
  props: {
    name: {
      required: true
    }
  },
  components: {
    Comment
  },
  computed: {
    ...mapState({
      data: state => state.feed.data
    })
  },
  data() {
    return {
      loaded: false
    };
  },
  methods: {
    ...mapActions(['getFeedData']),
    getData() {
      return this.getFeedData({
        name: this.name,
        pagination: this.currentPage,
        type: feedTypes.comments
      });
    }
  },
  async mounted() {
    await this.getData();
    this.loaded = true;
  }
};
</script>
<style lang="scss" scoped>
.likes-comments {
  padding: var(--element-padding-xl);
}
</style>

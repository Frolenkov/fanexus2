<template>
  <article
    class="activity-list-item"
    :class="{ 'activity-list-item__unseen': !data.isSeen }"
    v-if="activeAliasBlogId"
  >
    <div class="activity-list-item__date">
      {{ data.createdAt | dateFormat }}
    </div>
    <div :class="`activity-list-item__${data.type}`">
      <router-link
        :to="{
          name: 'blog',
          params: {
            name: data.sourceAlias.Blog.link || data.sourceAlias.Blog.id
          }
        }"
        >{{ data.sourceAlias.name }}</router-link
      >
      <component :is="`activity-${activityTypes[data.type]}`" :data="data" />
    </div>
  </article>
</template>

<script>
import { mapState } from 'vuex';
import { activityTypes } from '@/services/activities.service';
import ActivityComment from '@/components/Activities/ActivityComment.vue';
import ActivityFollow from '@/components/Activities/ActivityFollow.vue';
import ActivityInvite from '@/components/Activities/ActivityInvite.vue';
import ActivityLike from '@/components/Activities/ActivityLike.vue';
import ActivityReblog from '@/components/Activities/ActivityReblog.vue';

export default {
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  components: {
    ActivityComment,
    ActivityFollow,
    ActivityInvite,
    ActivityLike,
    ActivityReblog
  },
  data() {
    return {
      activityTypes
    };
  },
  computed: {
    ...mapState({
      activeAliasBlogId: state => state.alias.activeAliasBlog.id
    }),
    sourceAliasName() {
      return this.data.sourceAlias.name;
    }
  },
  methods: {
    preview(text) {
      const plainText = text.replace(/<[^>]+>/g, '');
      return (
        plainText.substring(0, 200) + (plainText.length > 200 ? '...' : '')
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.activity-list-item {
  color: var(--text-primary);
  background-color: var(--BG-blog-post);
  padding: var(--element-padding-m);
  border-radius: var(--border-radius);
  overflow-wrap: break-word;

  ::v-deep a {
    text-decoration: none;
    color: var(--text-secondary);
  }

  &__unseen {
    background-color: var(--BG-repost);
  }
}
</style>

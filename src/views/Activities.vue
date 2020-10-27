<template>
  <section class="activities" v-if="activities">
    <activity
      class="activities-item"
      v-for="(activity, index) in activities"
      :key="`${activity.id}-${index}`"
      :data="activity"
    />
  </section>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import Activity from '@/components/Activities/Activity.vue';

export default {
  components: {
    Activity
  },
  computed: {
    ...mapState({
      activities: state => state.activities.list,
      activeAliasId: state => state.alias.activeAliasId
    })
  },
  methods: {
    ...mapActions(['getActivitiesData']),
    getData() {
      return this.getActivitiesData({
        alias: this.activeAliasId
      });
    }
  },
  watch: {
    activeAliasId: {
      handler(val) {
        if (val) {
          return this.getData();
        }
      },
      immediate: true
    }
  }
};
</script>

<style lang="scss" scoped>
.activities {
  grid-area: content;
  overflow: auto;
  background-color: var(--BG-primary);
  padding: var(--element-padding-l);

  &-item:not(:first-child) {
    margin-top: var(--element-margin-s);
  }
}
</style>

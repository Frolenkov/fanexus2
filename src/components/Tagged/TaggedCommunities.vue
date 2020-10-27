<template>
  <div class="tagged-communities">
    <my-community-card
      :src="(group.coverImage && group.coverImage.src) || undefined"
      :membersCount="group.membersCount"
      :communityName="group.name"
      v-for="(group, index) in groups"
      :key="`${group.id}-${index}`"
      :data="group"
    />
  </div>
</template>

<script>
import { getTaggedCommunities } from '@/services/tag.service';
import MyCommunityCard from '@/components/Activities/MyCommunityCard';

export default {
  props: {
    tagNames: {
      required: true,
      type: String
    }
  },
  components: {
    MyCommunityCard
  },
  data() {
    return {
      groups: []
    };
  },
  methods: {
    async getData() {
      this.groups = await getTaggedCommunities(this.tagNames);
    }
  },
  mounted() {
    return this.getData();
  }
};
</script>
<style lang="scss" scoped>
.tagged-communities {
  padding: var(--element-padding-xl);
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: var(--element-margin-m);
}
</style>

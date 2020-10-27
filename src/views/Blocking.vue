<template>
  <div class="blocking">
    <following-following
      :data="data"
      @block="handleBlock"
      @remove-tag="unblockTag"
      button-type="block"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { getBlocking } from '@/services/following.service';
import { createBlock, deleteBlock } from '@/services/follow.service';
import { getTag } from '@/services/tag.service';
import FollowingFollowing from '@/components/Following/FollowingFollowing';

export default {
  components: { FollowingFollowing },
  data() {
    return {
      data: { followTag: [], followBlog: [], followCommunity: [] },
      currentPage: 1
    };
  },
  computed: {
    ...mapState({
      activeAliasId: state => state.alias.activeAliasId
    })
  },
  methods: {
    async handleBlock(data) {
      try {
        await createBlock(data.id, data.name, {
          alias: this.activeAliasId
        });
        await this.getData();
      } catch (e) {
        return false;
      }
    },
    async getData() {
      this.data = await getBlocking(this.activeAliasId);
    },
    async unblockTag(tagName) {
      const tagId = (await getTag(tagName)).find(tag => tag.name === tagName)
        .id;
      await deleteBlock(tagId, 'tag');
      await this.getData();
      await this.getActiveAliasStats({
        alias: this.activeAliasId,
        blog: this.activeAliasBlogId
      });
    }
  },
  watch: {
    activeAliasId: {
      handler(val) {
        if (val) {
          this.getData();
        }
      },
      immediate: true
    }
  }
};
</script>

<style lang="scss" scoped>
.blocking {
  grid-area: content;
  overflow-y: auto;
}
</style>

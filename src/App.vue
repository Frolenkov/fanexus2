<template>
  <div id="app">
    <component :is="layout">
      <router-view :key="`${routeKey}-${isAuthenticated}`" />
    </component>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { LAYOUTS } from '@/services/layout.service';

export default {
  computed: {
    layout() {
      const { meta = {} } = this.$route;
      const { DEFAULT } = LAYOUTS;

      return meta.layout || DEFAULT;
    },
    routeKey() {
      const { meta, params, fullPath } = this.$route;

      return meta.createPost || meta.showPost || meta.main
        ? `${meta.main || meta.page}-${params.tagNames ||
            params.name ||
            params.id}${params.order ? `-${params.order}` : ''}`
        : fullPath;
    },
    ...mapState({
      isAuthenticated: state => state.auth.isAuthenticated
    })
  }
};
</script>

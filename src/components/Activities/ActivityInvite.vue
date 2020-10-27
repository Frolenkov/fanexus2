<template>
  <span>
    has invited you to the
    <router-link
      :to="{ name: 'community', params: { id: data.targetCommunity.link } }"
      >{{ data.targetCommunity.name }}</router-link
    >
    community.
  </span>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      required: true
    }
  }
};
</script>

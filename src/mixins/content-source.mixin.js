import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState({
      activeAliasId: state => state.alias.activeAliasId,
      data: state => state.feed.data
    }),
    additionalOptions() {
      return this.data.userHasEditPermissions
        ? undefined
        : [
            {
              text: this.data.aliasBlocking ? 'Unblock' : 'Block',
              action: this.data.aliasBlocking ? 'unblock' : 'block',
              special: true,
              toggleable: false
            }
          ];
    }
  }
};

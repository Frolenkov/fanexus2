<template>
  <header class="header">
    <div class="header-left">
      <router-link class="header__home-link" :to="{ name: 'home' }"
        ><fanexus-login-logo class="fanexus-logo"
      /></router-link>
      <nav class="header-navigation">
        <ul class="header-navigation__list">
          <li>
            <router-link class="header-navigation__link" :to="{ name: 'home' }"
              >Feed</router-link
            >
          </li>
          <li v-if="activeAliasBlog && activeAliasBlog.id">
            <router-link
              class="header-navigation__link"
              :to="{
                name: 'blog',
                params: { name: activeAliasBlog.link || activeAliasBlog.id }
              }"
              >Blog</router-link
            >
          </li>
          <li>
            <router-link
              class="header-navigation__link"
              :to="{ name: 'community', params: { id: 1 } }"
              >Community</router-link
            >
          </li>
          <li>
            <div class="header-navigation__tags">
              <tag-input
                class="header-navigation__tags-field"
                name="tags"
                placeholder="Find by tags"
                :list="tags"
                @listChange="updateTags"
              />
              <form-button
                class="header-navigation__tags-find-button"
                @click.native.stop="goToTagFindPage"
                text="Go"
              />
            </div>
          </li>
        </ul>
      </nav>
    </div>
    <div class="header-right">
      <form-button
        v-if="canCreatePost"
        :header-button="true"
        @click.native.stop="openCreatePostModal"
        text="Create post"
      />
      <template v-if="!isAuthenticated">
        <form-button
          :header-button="true"
          @click.native.stop="openAuthModal({ tabIndex: 1, componentIndex: 1 })"
          text="Login"
        />
        <form-button
          :header-button="true"
          @click.native.stop="openAuthModal"
          text="Create account"
          type="submit"
        />
      </template>
    </div>
  </header>
</template>
<script>
import { routerSecureNavigation } from '@/services/router.service';
import FanexusLoginLogo from '~svg/fanexus-login-logo.svg';
import FormButton from '~common/Buttons/FormButton';
import TagInput from '~common/Fields/TagInput';
import { mapActions, mapState, mapGetters } from 'vuex';
import { hasToken } from '@/services/jwt.service';

export default {
  name: 'fanexus-header',
  components: {
    FanexusLoginLogo,
    FormButton,
    TagInput
  },
  data() {
    return {
      tags: []
    };
  },
  methods: {
    ...mapActions([
      'getUserAliases',
      'setLoggedIn',
      'initActiveAlias',
      'logout'
    ]),
    openAuthModal({ tabIndex = 0, componentIndex = 0 }) {
      this.$emit('openAuthModal', { tabIndex, componentIndex });
    },
    openCreatePostModal() {
      this.$emit('openCreatePostModal');
    },
    updateTags(tags) {
      this.tags = tags;
    },
    goToTagFindPage() {
      routerSecureNavigation(
        {
          name: 'tagged-blog-posts',
          params: { tagNames: JSON.stringify(this.tags) }
        },
        this.tags
      );
    }
  },
  computed: {
    ...mapState({
      isAuthenticated: state => state.auth.isAuthenticated,
      userAliases: state => state.alias.userAliases,
      activeAliasId: state => state.alias.activeAliasId
    }),
    ...mapGetters(['activeAliasBlog']),
    canCreatePost() {
      const { meta } = this.$route;
      return this.isAuthenticated && !!meta.createPost;
    }
  },
  async mounted() {
    if (hasToken()) {
      try {
        await this.getUserAliases();
        this.setLoggedIn(true);
      } catch (e) {
        if (e.response.status === 401) {
          await this.logout();
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.fanexus-logo {
  /*@TODO fix issue when the modal is open*/
  fill: var(--color-white);
  height: 15px;
  margin-right: calc(var(--element-margin-xxl) * 2);
}
.aside-menu.toggled + .header {
  margin-left: -200px;
}
.header {
  grid-area: header;
  background-color: var(--BG-navbar);
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: var(--transition-default);
  padding: 0 var(--element-padding-xl) 0 calc(var(--element-padding-xl) * 2);

  &__home-link {
    z-index: var(--z-index-1);
  }
  &-left {
    display: flex;
    align-items: center;
  }
  &-right {
    display: flex;
  }
  &-navigation {
    display: flex;
    &__list {
      display: flex;
      align-items: center;
      margin: 0;
      list-style: none;
    }
    &__tags {
      display: flex;
      align-items: center;
      &-field {
        padding: 0 var(--element-padding-xs);
      }
      &-find-button {
        margin-left: var(--element-margin-xs);
      }
    }

    ::v-deep &__link {
      color: var(--color-white);
      font-size: var(--size-button);
      font-weight: 600;
      text-transform: uppercase;
      margin-right: var(--element-margin-xxl);
      text-decoration: none;
      &:focus {
        color: var(--color-main-600);
      }

      &.router-link-exact-active {
        color: var(--border-tag);
      }
    }
  }
}
.wrapper.logged .header {
  padding: 0 calc(var(--element-padding-xl) * 2);
  min-height: 60px;
}
</style>

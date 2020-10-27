<template>
  <aside class="aside-menu" :class="{ toggled: show }">
    <div class="aside-menu__fixed">
      <button type="button" class="menu-toggler" @click="handleAsideToggled">
        <span></span>
      </button>
      <div v-if="userAliases" class="icons-bar">
        <div
          :key="`${id}-${index}`"
          v-for="({ id, avatar }, index) in userAliases"
          class="icons-bar__image"
          :class="{ active: activeAlias(id) }"
          @click="aliasClickHandler(id)"
        >
          <!-- /*@TODO add dynamic data*/ -->
          <avatar
            size="md"
            :file="Blog && Blog.avatar ? Blog.avatar.src : ''"
          />
          <!-- <badge :info="12" /> @TODO resolve after FAN-175 will be resolved -->
        </div>
        <button
          @click.stop="showAddAliasPopup"
          class="icons-bar__image icons-bar__image--new-account"
          :class="{ disabled }"
          :disabled="disabled"
        >
          <plus-icon />
        </button>
      </div>
    </div>
    <div class="aside-menu__toggler">
      <nav class="aside-menu-navigation">
        <h3 v-if="activeAliasBlog">{{ activeAliasBlog.name }}</h3>
        <ul>
          <li v-if="activeAliasBlog" class="aside-menu-navigation__link">
            <router-link
              class="header-navigation__link"
              :to="{
                name: 'blog',
                params: { name: activeAliasBlogUrl }
              }"
              >My Blog</router-link
            >
          </li>
          <li class="aside-menu-navigation__link">
            <router-link :to="{ name: 'my-communities' }"
              >My Communities</router-link
            >
          </li>
          <li
            class="aside-menu-navigation__link"
            v-if="
              activeAliasStats.following && activeAliasStats.following.count
            "
          >
            <router-link :to="{ name: 'following' }"
              >Following<badge :info="activeAliasStats.following.count"
            /></router-link>
          </li>
          <li
            class="aside-menu-navigation__link"
            v-if="
              activeAliasStats.followers && activeAliasStats.followers.count
            "
          >
            <router-link :to="{ name: 'followers' }"
              >Followers <badge :info="activeAliasStats.followers.count"
            /></router-link>
          </li>
          <li
            class="aside-menu-navigation__link"
            v-if="
              activeAliasBlog &&
                activeAliasStats.following &&
                activeAliasStats.likes.count
            "
          >
            <router-link
              :to="{ name: 'blog-likes', params: { name: activeAliasBlogUrl } }"
              >Likes <badge :info="activeAliasStats.likes.count"
            /></router-link>
          </li>
          <li class="aside-menu-navigation__link">
            <router-link :to="{ name: 'activities' }" v-if="activeAliasBlog">
              Activities<badge
                :info="activeAliasStats.activities.count"
                v-if="
                  activeAliasStats.activities &&
                    activeAliasStats.activities.count
                "
              />
            </router-link>
          </li>
          <li class="aside-menu-navigation__link">
            <router-link :to="{ name: 'invites' }">Invites</router-link>
          </li>
          <li class="aside-menu-navigation__link">
            <router-link :to="{ name: 'blocking' }">Blocking</router-link>
          </li>
          <li class="aside-menu-navigation__link">
            <router-link :to="{ name: 'privacy-groups' }"
              >Privacy groups</router-link
            >
          </li>
          <li class="aside-menu-navigation__link">
            <router-link
              :to="{ name: 'settings-auth' }"
              :class="{
                'router-link-exact-active': $route.name.includes('settings-')
              }"
              >Settings</router-link
            >
          </li>
        </ul>
      </nav>
      <div class="aside-menu__btns">
        <div class="aside-menu__theme-toggler">
          <form-toggler
            name="theme"
            class="form-toggler"
            v-model="themeDarkValue"
            :checked="themeDark"
          >
            Dark mode
          </form-toggler>
        </div>
        <button
          type="button"
          class="aside-menu__logout-btn"
          @click="logoutBtnHandler"
        >
          Logout
          <logout-icon class="logout-icon" />
        </button>
      </div>
    </div>
    <alias-modal
      :settings="aliasModalSettings"
      v-if="aliasModalSettings.show"
      :data="aliasPopupModalData"
      @close="handleAliasModalClosed"
    />
  </aside>
</template>
<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import Badge from '~common/Badge';
import Avatar from '~common/Avatar';
import AliasModal from '~common/AliasModal';
import PlusIcon from '~svg/plus.svg';
import LogoutIcon from '~svg/logout.svg';
import FormToggler from '~common/Fields/FormToggler';

export default {
  name: 'fanexus-aside-menu',
  components: {
    PlusIcon,
    FormToggler,
    LogoutIcon,
    Avatar,
    Badge,
    AliasModal
  },
  data() {
    return {
      aliasModalSettings: {
        show: false,
        title: 'Alias',
        dismissText: 'Cancel',
        actionText: 'Save'
      },
      aliasPopupModalData: {
        text:
          'Alias`s image may be changed (it will also be placed at the blog). Alias name can`t be changed (you may change it in the blog).',
        accessUrl: '',
        baseUrl: '',
        imageIdentifier: '',
        aliasName: ''
      }
    };
  },
  props: {
    show: {
      type: Boolean,
      default: false,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    /*@TODO add a corresponding side effect to the login action (if needed) */
    ...mapActions([
      'logout',
      'getUserAliases',
      'setActiveAlias',
      'removeActiveAlias',
      'clearUserAliases',
      'getActiveAliasStats',
      'setPrivacyGroups',
      'watchActiveAliasActivitiesCount',
      'unwatchActiveAliasActivitiesCount',
      'setTheme'
    ]),
    handleAsideToggled() {
      this.$emit('asideToggled');
    },
    showAddAliasPopup() {
      this.aliasModalSettings.show = true;
    },
    async aliasClickHandler(newActiveAliasId) {
      if (newActiveAliasId !== this.activeAliasId) {
        await this.setActiveAlias(newActiveAliasId);
        return this.setPrivacyGroups();
      }
    },
    /** @TODO revise if needed */
    refreshAliasModalData() {
      this.aliasPopupModalData = {
        ...this.aliasPopupModalData,
        imageIdentifier: '',
        aliasName: '',
        accessUrl: '',
        baseUrl: ''
      };
    },
    handleAliasModalClosed() {
      this.aliasModalSettings.show = false;
      this.refreshAliasModalData();
    },
    async logoutBtnHandler() {
      await this.logout();
      this.removeActiveAlias();
      this.clearUserAliases();
    }
  },
  computed: {
    ...mapState({
      themeDark: state => state.theme.themeDark,
      userAliases: state => state.alias.userAliases,
      activeAliasStats: state => state.alias.activeAliasStats,
      activeAliasId: state => state.alias.activeAliasId
    }),
    ...mapGetters([
      'activeAliasBlog',
      'activeAliasBlogUrl',
      'activeAliasBlogId'
    ]),
    activeAlias() {
      return id => this.activeAliasId === id;
    },
    themeDarkValue: {
      get: function() {
        return this.themeDark;
      },
      set: function(value) {
        this.setTheme(value);
      }
    }
  },
  watch: {
    activeAliasBlogId: {
      async handler(val, oldVal) {
        if (val) {
          if (oldVal) {
            await this.unwatchActiveAliasActivitiesCount();
          }
          await this.setPrivacyGroups();
          await this.getActiveAliasStats({
            alias: val,
            blog: this.activeAliasBlogId
          });
          await this.watchActiveAliasActivitiesCount();
        }
      },
      immediate: true
    }
  },
  async mounted() {
    if (!this.userAliases.length) {
      await this.getUserAliases();
    }
  }
};
</script>
<style lang="scss" scoped>
.wrapper.logged .aside-menu {
  display: flex;
}
.aside-menu {
  grid-area: aside;
  display: none;
  overflow: hidden;
  width: 60px;
  transition: var(--transition-default);

  &.toggled {
    width: 260px;
    .aside-menu__toggler {
      left: 60px;
    }
  }

  &.toggled .menu-toggler:before {
    transform: rotate(45deg);
    left: 0px;
    top: 6px;
  }

  &.toggled .menu-toggler:after {
    opacity: 0;
  }

  &.toggled .menu-toggler span {
    transform: rotate(-45deg);
    left: 0px;
    top: 6px;
  }

  &__fixed {
    position: relative;
    z-index: var(--z-index-1);
    width: 60px;
    background: var(--BG-navbar);

    .menu-toggler {
      display: block;
      width: 19px;
      height: 12px;
      position: relative;
      margin: var(--element-margin-l) auto;
      background: none;
      transition: var(--transition-default);
      &:focus {
        outline: none;
      }
      &:focus {
        span {
          background-color: var(--BG-button-primary-hover);
        }
        &:before,
        &:after {
          background-color: var(--BG-button-primary-hover);
        }
      }

      &:before,
      &:after,
      & span {
        position: absolute;
        height: 2px;
        width: 19px;
        top: 0;
        left: 0;
        content: '';
        border-radius: var(--border-radius);
        background-color: var(--color-white);
        transition: var(--transition-default);
      }

      &:after {
        top: 5px;
      }

      & span {
        top: 10px;
      }
    }

    .icons-bar {
      padding: var(--element-padding-s);
      padding-top: var(--element-padding-l);

      &__image {
        width: 40px;
        height: 40px;
        border-radius: var(--border-radius);
        margin-bottom: var(--element-margin-l);
        position: relative;
        cursor: pointer;
        opacity: var(--opacity-image-overlay);
        transition: var(--transition-default);
        ::v-deep img {
          border: var(--border-width-thin) solid transparent;
        }

        &--new-account {
          background-color: var(--color-white);
          display: flex;
          justify-content: center;
          align-items: center;
          &:focus {
            outline: none;
          }
          &:hover {
            background-color: var(--checkbox-normal);
          }
          &.disabled {
            background-color: var(--text-create-account-inactive);
            ::v-deep svg {
              fill: var(--BG-input);
            }
          }
        }

        &.active {
          opacity: 1;
          box-shadow: var(--box-shadow-alias);

          ::v-deep img {
            border: var(--border-width-thin) solid var(--color-white);
          }
        }

        ::v-deep img {
          height: 100%;
          width: 100%;
          object-position: top;
        }

        ::v-deep .badge {
          position: absolute;
          top: -10px;
          right: 0;
        }
      }
    }
  }

  &__toggler {
    padding-bottom: var(--element-padding-xxl);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: absolute;
    height: 100%;
    left: -140px;
    width: var(--width-small);
    padding-top: 60px;
    padding-left: var(--element-padding-s);
    background-color: var(--BG-aside-togglable);
    transition: var(--transition-default);
    box-shadow: var(--box-shadow);
  }

  &__btns {
    padding-left: var(--element-padding-s);
    font-size: var(--size-regular);
  }

  &__theme-toggler {
    margin-bottom: var(--element-margin-m);
    margin-top: var(--element-margin-m);
    color: var(--color-white);

    .form-toggler {
      vertical-align: middle;
    }
  }

  &__logout-btn {
    background: none;
    color: var(--color-white);
    margin-bottom: var(--element-margin-m);
    margin-top: var(--element-margin-m);
    &:focus {
      outline: none;
      color: var(--color-main-500);
      .logout-icon {
        fill: var(--color-main-500);
      }
    }

    .logout-icon {
      margin-left: var(--element-margin-xs);
      vertical-align: bottom;
      height: 12px;
      fill: var(--color-white);
    }
  }

  h3 {
    padding: var(--element-padding-s);
    background-color: rgba(255, 255, 255, 0.25);
    border-top-left-radius: var(--border-radius);
    border-bottom-left-radius: var(--border-radius);
    margin-bottom: var(--element-margin-xl);
    color: var(--color-white);
    font-size: var(--size-regular);
    font-family: 'OpenSans-Bold', sans-serif;
    line-height: 21px;
  }

  &-navigation {
    padding-top: var(--element-padding-s);
    list-style: none;

    &__link {
      margin-bottom: var(--element-padding-s);
      display: flex;
      align-items: center;

      ::v-deep .badge {
        padding: 0 calc(var(--button-padding-m) / 1.5);
        margin-left: 15px;
        display: block;
      }

      ::v-deep a {
        padding: var(--element-padding-s);
        border-top-left-radius: var(--border-radius);
        border-bottom-left-radius: var(--border-radius);
        text-decoration: none;
        color: var(--color-white);
        font-size: var(--size-regular);
        line-height: 21px;
        width: 100%;
        display: flex;
        transition: var(--transition-default);

        &.router-link-exact-active {
          background-color: var(--BG-navbar);
          border-top-left-radius: var(--border-radius);
          border-bottom-left-radius: var(--border-radius);
        }

        &:hover {
          background-color: var(--BG-navbar);
        }

        &:focus {
          background-color: var(--BG-navbar);
        }
      }
    }
  }
}
</style>

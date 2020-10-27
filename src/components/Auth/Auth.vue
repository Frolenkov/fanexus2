<template>
  <modal :settings="settings" @close="handleModalClose" class="auth">
    <div class="auth-image" slot="modal-image"></div>
    <fanexus-login-logo class="fanexus-logo" slot="header" />
    <tabs
      class="tabs--auth"
      slot="body"
      :tabs="visibleTabs"
      @selectTab="$active => setComponent($active, $active)"
      :active="activeTab"
    >
      <form action="#" class="auth-form" @submit.prevent="handleSubmit">
        <component
          :is="currentComponent"
          :formData="formData"
          ref="currentComponentRef"
        />
        <form-button :full-width="true" type="submit" :text="submitText" />
      </form>
      <a
        class="auth-form__forgot"
        v-if="currentComponent === authAreas.login"
        @click.prevent.stop="setComponent(0, 2)"
        >Forgot password?</a
      >
    </tabs>
  </modal>
</template>
<script>
import getComponentsByPrefix from '@/utils/getComponentsByPrefix';
import { authRoot, authAreas } from '@/services/auth.service';
import { mapActions } from 'vuex';
import FanexusLoginLogo from '~svg/fanexus-login-logo.svg';
import tabsMixin from '@/mixins/tabs.mixin';
import validationMixin from '@/mixins/validation.mixin';
import Modal from '~common/Modal';
import Tabs from '~common/Tabs';
import FormInput from '~fields/FormInput';
import FormButton from '~common/Buttons/FormButton';

// auth components
import AuthCreateAccount from '@/components/Auth/AuthCreateAccount';
import AuthLogin from '@/components/Auth/AuthLogin';
import AuthResetPassword from '@/components/Auth/AuthResetPassword';
import AuthPassEmail from '@/components/Auth/AuthPassEmail';

export default {
  props: {
    settings: {
      type: Object,
      required: true
    }
  },
  components: {
    Modal,
    Tabs,
    FormInput,
    FanexusLoginLogo,
    FormButton,
    // auth components
    AuthCreateAccount,
    AuthLogin,
    AuthPassEmail,
    AuthResetPassword
  },
  mixins: [tabsMixin, validationMixin],
  data() {
    return {
      authAreas,
      /*@TODO revise dynamic data*/
      formData: {
        name: null,
        email: null,
        emailConfirm: null,
        password: null,
        passwordConfirm: null,
        ageCheck: false,
        selectedDate: null
      },
      navTabs: [
        [
          {
            title: 'Create account',
            component: authAreas.createUser,
            submitText: 'Join Fanexus'
          },
          { title: 'Login', component: authAreas.login, submitText: 'Login' }
        ],
        /*@TODO revise pass email*/
        [
          {
            title: 'Pass an email',
            component: authAreas.passEmail,
            submitText: 'Send an email'
          }
        ],
        [
          {
            title: 'Reset password',
            component: authAreas.resetPassword,
            submitText: 'Reset password'
          }
        ]
      ],
      currentComponent: null
    };
  },
  computed: {
    authComponents() {
      return getComponentsByPrefix.call(this, authRoot);
    },
    submitText() {
      const currentTab = this.visibleTabs.find(
        t => t.component === this.currentComponent
      );
      return currentTab ? currentTab.submitText : null;
    },
    visibleTabs() {
      switch (this.currentComponent) {
        case authAreas.passEmail:
          return this.navTabs[1];

        case authAreas.resetPassword:
          return this.navTabs[2];
      }
      // 'auth-create-account', 'login'
      return this.navTabs[0];
    }
  },
  watch: {
    formData: {
      handler() {
        this.handleCheckClientValidation();
      },
      deep: true
    }
  },
  methods: {
    ...mapActions(['createUser', 'login']),
    /*@TODO revise the name, i think currently it's not closing the modal but refreshing its state*/
    handleModalClose() {
      this.activeTab = 0;
      this.setComponent();
    },
    setComponent(tabIndex = 0, componentIndex = 0) {
      this.handleSetActiveTab(tabIndex);
      this.currentComponent = this.authComponents[componentIndex];
    },
    handleCheckClientValidation() {
      const { $refs = {} } = this.$refs.currentComponentRef;
      return this.checkClientValidation({
        refs: { passwordConfirmRef: $refs.passwordConfirmRef }
      });
    },
    async handleSubmit() {
      if (!this.handleCheckClientValidation()) return;

      const currentArea = Object.entries(this.authAreas).find(
        i => i[1] === this.currentComponent
      );

      if (currentArea && currentArea.length) {
        const action = this[currentArea[0]];

        if (action) {
          await action(this.formData);
          this.$emit('submit');
        }
      }
    }
  },
  mounted() {
    const [tabIndex, componentIndex] = this.settings.initialTab;

    this.setComponent(tabIndex, componentIndex);
  }
};
</script>
<style lang="scss" scoped>
.fanexus-logo {
  fill: var(--color-main-800);
  height: 10px;
}

.auth {
  background: var(--color-main-800);
  display: flex;
  align-items: center;
  justify-content: center;
  &-form {
    width: 250px;

    ::v-deep &-content {
      display: flex;
      flex-direction: column;
    }
    &__forgot {
      font-size: var(--size-small);
      margin-top: var(--element-margin-s);
      color: var(--text-create-account-active);
      cursor: pointer;
    }
  }

  &-image {
    background: url('~@/assets/img/login-image.png') center no-repeat;
    width: 344px;
    height: 568px;
  }

  ::v-deep {
    .button {
      background-color: var(--color-main-800);
      &:hover,
      &:focus {
        color: var(--color-white);
        background-color: var(--color-main-700);
      }
    }
    .modal-header {
      position: relative;
      height: 20px;
      padding: 0;
      margin: var(--element-margin-xl) 0;
      background: var(--color-white);
      box-shadow: none;
      &-btn__close {
        top: 0;
        right: 0;
        transform: translateX(100%);
        &:before,
        &:after {
          background: var(--color-main-900);
        }
        &:focus {
          outline: none;
        }
      }
    }

    .modal-content {
      overflow: initial;
    }
    .modal-body {
      background: var(--color-white);
      padding: 0;
    }
    .modal {
      background: var(--color-white);
    }

    .nav-tabs {
      margin-bottom: var(--element-margin-l);
      height: auto;
      li {
        border-color: var(--tab-normal);
        margin-left: 0;
        button {
          font-size: var(--size-title);
          color: var(--tab-normal);
          white-space: nowrap;
          height: 100%;
          width: 100%;
          text-transform: capitalize;
          padding-bottom: var(--button-padding-m);
          margin-bottom: var(--element-margin-s);
          &:focus {
            outline: none;
          }
        }
        &.active {
          border-color: var(--color-main-700);
          > button {
            color: var(--color-main-700);
            font-size: var(--size-title);
          }
        }
      }
    }
    .checkbox {
      &__icon:before {
        border-bottom: var(--border-width-default) solid
          var(--BG-button-primary);
        border-right: var(--border-width-default) solid var(--BG-button-primary);
      }
      &__text {
        color: var(--color-main-900);
      }
    }

    .form-input {
      margin-bottom: var(--element-margin-s);
      input {
        color: var(--color-main-900);
        border-color: var(--color-main-500);
        &:hover {
          border-color: var(--color-main-900);
        }
        &:focus {
          border-color: var(--color-main-700);
        }
        &::placeholder {
          color: var(--color-main-500);
        }
        &.disabled {
          border-color: var(--text-create-account-inactive);
          color: var(--text-create-account-inactive);
        }
        &.disabled::placeholder {
          color: var(--text-create-account-inactive);
        }
      }
    }
  }
}
</style>

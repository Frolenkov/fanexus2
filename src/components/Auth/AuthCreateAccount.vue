<template>
  <div class="auth-form-content create-account">
    <form-input
      placeholder="Email"
      type="email"
      name="email"
      v-model="formData.email"
      required
    />
    <form-input
      placeholder="Name"
      type="name"
      name="name"
      v-model="formData.name"
      required
    />
    <form-checkbox
      @input="ageCheckHandler"
      v-model="formData.ageCheck"
      name="ageCheck"
    >
      I am under 18
    </form-checkbox>
    <date-dropdown
      v-if="formData.ageCheck"
      default="1995-01-10"
      min="1920"
      :max="new Date().getFullYear().toString()"
      v-model="formData.selectedDate"
    />
    <form-input
      placeholder="Password"
      type="password"
      name="password"
      v-model="formData.password"
      required
    />
    <form-input
      placeholder="Confirm password"
      type="password"
      name="passwordConfirm"
      v-model="formData.passwordConfirm"
      ref="passwordConfirmRef"
      required
    />
  </div>
</template>

<script>
import { authAreas } from '@/services/auth.service';
import authMixin from '@/mixins/auth.mixin';

export default {
  name: authAreas.createUser,
  mixins: [authMixin],
  methods: {
    ageCheckHandler() {
      if (!this.formData.ageCheck) {
        this.formData.selectedDate = null;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
::v-deep {
  .checkbox {
    margin: var(--element-margin-m) 0;
    align-self: flex-start;
    &__icon:before {
      border-bottom: 2px solid var(--color-white);
      border-right: 2px solid var(--color-white);
    }
  }
  .date-dropdown-container {
    margin-bottom: var(--element-margin-s);
  }
}
</style>

<template>
  <v-layout column justify-center>
    <snackbar color="error" :text="errorMessage"></snackbar>
    <v-flex xs12 sm4 offset-sm4 text-xs-center>
      <v-card class="pa-3">
        <v-form v-model="valid" ref="form" lazy-validation>
          <v-text-field
            name="email"
            label="Email"
            v-model="email"
            :rules="emailRules"
            required
          ></v-text-field>
          <v-text-field
            label="Password"
            hint="At least 8 characters"
            v-model="password"
            min="8"
            :type="'password'"
            :rules="passwordRules"
            required
          ></v-text-field>
          <v-text-field
            label="Confirm Password"
            hint="Re-enter your password"
            v-model="confirmPassword"
            min="8"
            :type="'password'"
            :rules="passwordRules"
            required
          ></v-text-field>
          <v-checkbox
            label="Do you agree?"
            v-model="checkbox"
            :rules="[v => !!v || 'You must agree to continue!']"
            required
          ></v-checkbox>
          <v-btn color="secondary" @click.native="goBack">Back</v-btn>
          <v-btn color="primary" @click="submit">Next</v-btn>
        </v-form>
      </v-card>
    </v-flex>
  </v-layout>

</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'

import Snackbar from '~/components/Snackbar'

export default {
  components: {
    Snackbar
  },

  data () {
    return {
      valid: false,
      email: '',
      emailRules: [
        (v) => !!v || 'E-mail is required',
        (v) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
      ],
      password: '',
      confirmPassword: '',
      passwordRules: [
        (v) => !!v || 'Password is required'
      ],
      checkbox: false,
      errorMessage: ''
    }
  },

  computed: {
    ...mapState([
      'displaySnackbar'
    ])
  },

  methods: {
    ...mapMutations({
      showSnackbar: 'SHOW_SNACKBAR'
    }),

    ...mapActions({
      createUser: 'createUserWithEmailAndPassword'
    }),

    goBack () {
      this.$router.push('/')
    },

    submit () {
      const vm = this

      if (this.$refs.form.validate()) {
        return vm.createUser({
          email: vm.email,
          password: vm.password
        })
          .then(() => {
            vm.$router.push('/')
          })
          .catch(err => {
            switch (err.message) {
              case 'DuplicateEmail':
                vm.errorMessage = 'An email with this account already exists'
                vm.showSnackbar()
                break
              case 'InvalidEmail':
                vm.errorMessage = 'Invalid email specified'
                vm.showSnackbar()
                break
              default:
                vm.errorMessage = 'Server error'
                vm.showSnackbar()
            }
          })
      }
    }
  }
}
</script>

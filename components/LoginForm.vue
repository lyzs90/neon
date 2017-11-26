<template>
  <v-layout>
    <snackbar color="success" :text="successMessage"></snackbar>
    <v-flex xs12 sm4 offset-sm4 text-xs-center>
      <v-card class="pa-3">
        <v-form v-model="valid">
          <v-text-field
            name="email"
            label="Email"
            v-model="email"
            :rules="emailRules"
            required
          ></v-text-field>
          <v-text-field
            label="Password"
            v-model="password"
            :type="'password'"
            :rules="passwordRules"
            required
          ></v-text-field>
          <v-btn color="primary" @click.native="submit">Next</v-btn>
        </v-form>
      </v-card>
    </v-flex>
  </v-layout>

</template>

<script>
import { mapActions, mapMutations } from 'vuex'

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
      passwordRules: [
        (v) => !!v || 'Password is required'
      ],
      successMessage: ''
    }
  },

  methods: {
    ...mapActions({
      emailLogin: 'signInWithEmail'
    }),

    ...mapMutations({
      showSnackbar: 'SHOW_SNACKBAR'
    }),

    submit () {
      const vm = this

      return vm.emailLogin({
        email: vm.email,
        password: vm.password
      })
        .then(() => {
          vm.successMessage = 'You are logged in!'
          vm.showSnackbar()
          vm.$router.go(-1)
        })
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>

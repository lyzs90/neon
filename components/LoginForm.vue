<template>
  <v-card class="pa-3">
    <v-card-title>
      Log in
    </v-card-title>
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
</template>

<script>
import { mapActions, mapMutations } from 'vuex'

export default {
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
      ]
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
      return this.emailLogin({
        email: this.email,
        password: this.password
      })
        .then(() => {
          this.showSnackbar({
            color: 'success',
            message: 'You are logged in!'
          })
          this.$emit('close')
        })
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>

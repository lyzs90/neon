<template>
  <v-layout>
    <v-flex text-xs-center>
      <v-form v-model="valid">
        <v-text-field
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
      </v-form>
      <v-btn color="primary" @click.native="submit">Next</v-btn>
    </v-flex>
  </v-layout>

</template>

<script>
import { mapActions } from 'vuex'

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

    submit () {
      const vm = this

      return vm.emailLogin({
        email: vm.email,
        password: vm.password
      })
        .then(() => {
          vm.$router.go(-1)
        })
    }
  }
}
</script>

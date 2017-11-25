<template>
  <section class="container">
    <div>
      <logo/>
      <h1 class="title">
        neon
      </h1>
      <h2 class="subtitle">
        The frontend
      </h2>
      <div class="links">
        <a href="https://nuxtjs.org/" target="_blank" class="button--green">Documentation</a>
        <a href="https://github.com/nuxt/nuxt.js" target="_blank" class="button--grey">GitHub</a>
      </div>
      <v-btn v-if="!authenticated" @click='logIn' color='primary'>Log in</v-btn>
      <v-btn v-if="authenticated" @click='logOut' color='secondary'>Log out</v-btn>
      <p>User: {{ (user && user.displayName) || 'null' }}</p>
      <p>Authenticated: {{ authenticated }}</p>
    </div>
  </section>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

import { auth } from '~/services/firebaseService'
import Logo from '~/components/Logo.vue'

export default {
  components: {
    Logo
  },

  computed: {
    ...mapGetters([
      'authenticated'
    ]),

    ...mapState([
      'user'
    ])
  },

  methods: {
    logIn () {
      this.$router.push('/login')
    },

    logOut () {
      auth.signOut()
    }
  }
}
</script>

<style>
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; /* 1 */
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>

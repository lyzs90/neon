<template>
  <v-app light>
    <!-- Nav -->
    <navigation :display="nav.display" :shrink="nav.shrink"></navigation>
    <v-content>
      <snackbar :display="snackbar.display" :color="snackbar.color" :text="snackbar.message"></snackbar>

      <!-- Spinner -->
      <v-layout v-if="mainSpinner.display" row justify-center align-center class="h-100">
        <v-progress-circular indeterminate v-bind:size="70" v-bind:width="7" color="primary"></v-progress-circular>
      </v-layout>

      <!-- View -->
      <nuxt v-if="!mainSpinner.display" />
    </v-content>
  </v-app>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

import Navigation from '~/components/Navigation'
import Snackbar from '~/components/Snackbar'

export default {
  components: {
    Navigation,
    Snackbar
  },

  computed: {
    ...mapState([
      'nav',
      'snackbar',
      'mainSpinner'
    ])
  },

  methods: {
    ...mapMutations({
      shrinkNav: 'SHRINK_NAV',
      unshrinkNav: 'UNSHRINK_NAV'
    }),

    onScroll (e) {
      if (window || document.documentElement) {
        if (window.pageYOffset > 50 || document.documentElement.scrollTop > 50) {
          this.shrinkNav()
        } else {
          this.unshrinkNav()
        }
      }
    }
  }
}
</script>

<style>
html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*, *:before, *:after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
</style>

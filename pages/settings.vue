<template>
  <v-container fluid :class="{'ma-1': $vuetify.breakpoint.smAndUp}">
    <v-layout row wrap>
      <v-flex xs12 sm3 :class="{'ml-3':$vuetify.breakpoint.smAndUp}">
        <v-card class="w-100" height="245">
          <v-list class="pa-0">
            <template v-for="(item, index) in items">
              <v-list-tile ripple @click="navigateTo(item)" :key="index" :class="{ 'blue': item.link === $route.path }">
                <v-list-tile-content>
                  <v-list-tile-title :class="{ 'white--text': item.link === $route.path }">{{ item.title }}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-divider v-if="index + 1 < items.length" :key="index"></v-divider>
            </template>
          </v-list>
        </v-card>
      </v-flex>
      <v-flex xs12 sm8 justify-center :class="{'mt-3': $vuetify.breakpoint.xsOnly, 'ml-5':$vuetify.breakpoint.smAndUp}">
        <!-- Child Content -->
        <nuxt-child v-if="!settingsSpinner.display" />

        <!-- Settings Spinner -->
        <v-layout v-if="settingsSpinner.display" row justify-center align-center vh-90>
          <v-progress-circular indeterminate v-bind:size="70" v-bind:width="7" color="primary"></v-progress-circular>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {
      items: [
        { title: 'Profile', link: '/settings/profile' },
        { title: 'Stripe Account', link: '/settings/stripe' },
        { title: 'Wallet', link: '/settings/wallet' },
        { title: 'Password', link: '/settings/password' },
        { title: '2FA', link: '/settings/2fa' }
      ]
    }
  },

  computed: {
    ...mapState([
      'settingsSpinner'
    ])
  },

  methods: {
    navigateTo (item) {
      this.$router.push(item.link)
    }
  }
}
</script>

<style lang="css">
</style>

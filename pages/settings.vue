<template>
  <v-container fluid :class="{'ma-3': $vuetify.breakpoint.smAndUp}">
    <v-layout row wrap>
      <v-flex xs12 sm3>
        <v-card class="w-100">
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
      <v-flex xs12 sm9 mt-3 justify-center>
        <nuxt-child />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

export default {
  data () {
    return {
      items: [
        { title: 'Summary', link: '/settings/summary' },
        { title: 'Stripe Account', link: '/settings/stripe' },
        { title: 'Wallet', link: '/settings/wallet' },
        { title: 'Password', link: '/settings/password' },
        { title: '2FA', link: '/settings/2fa' }
      ]
    }
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

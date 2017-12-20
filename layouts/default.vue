<template>
  <v-app light>
    <v-toolbar v-if="!nav.display" fixed app>
      <v-avatar @click="openNav" class="cyan cursor ma-3">
        <span class="white--text headline small-caps">{{ userInitials }}</span>
      </v-avatar>
    </v-toolbar>
    <v-navigation-drawer fixed stateless dark class="blue" v-if="nav.display" :value="nav.display" v-on-clickaway="closeNav"app>
      <v-list>
        <v-list-tile @click="navigateTo(item.link)" v-for="item in items" :key="item.title">
          <v-list-tile-action>
            <v-icon dark>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-content>
      <snackbar :color="snackbar.color" :text="snackbar.message"></snackbar>
      <nuxt />
    </v-content>
  </v-app>
</template>

<script>
import { directive as onClickaway } from 'vue-clickaway'
import { mapState, mapGetters, mapMutations } from 'vuex'

import Snackbar from '~/components/Snackbar'

export default {
  directives: {
    onClickaway
  },

  components: {
    Snackbar
  },

  data () {
    return {
      items: [
        { icon: 'home', title: 'Home', link: '/' },
        { icon: 'store', title: 'Marketplace', link: '/marketplace' },
        { icon: 'view_quilt', title: 'My Policies', link: '/policies' },
        { icon: 'help', title: 'FAQ', link: '/faq' },
        { icon: 'settings', title: 'Settings', link: '/settings' }
      ]
    }
  },

  computed: {
    ...mapState([
      'nav',
      'snackbar'
    ]),

    ...mapGetters([
      'userInitials'
    ])
  },

  methods: {
    ...mapMutations({
      openNav: 'OPEN_NAV',
      closeNav: 'CLOSE_NAV'
    }),

    navigateTo (link) {
      this.$router.push(link)
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

.cursor {
  cursor: pointer;
}
</style>

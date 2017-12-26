<template>
  <v-layout>
    <!-- Tablet / Desktop -->
    <v-layout class="hidden-xs-only">
      <v-toolbar v-if="!displayNav" fixed app>

        <v-layout class="ml-3 mr-3">
          <v-flex sm6>
            <v-layout row justify-start align-center>
              <v-avatar class="cyan ma-3">
                <span class="white--text headline small-caps">{{ userInitials }}</span>
              </v-avatar>
              <v-layout @click="navigateTo(item.link)" v-for="item in items" v-if="item.showSmAndUp" :key="item.title" class="cursor pa-3 flex-initial">
                {{ item.title }}
              </v-layout>
            </v-layout>
          </v-flex>
          <v-flex sm6>
            <v-layout row justify-end align-center>
              <v-btn v-if="!authenticated" @click='signUp' color='secondary'>Sign up</v-btn>
              <v-btn v-if="!authenticated" @click='logIn' color='primary'>Log in</v-btn>
              <v-btn v-if="authenticated" @click='logOut' color='secondary'>Log out</v-btn>
              <span class="cursor pa-3">FAQ</span>
            </v-layout>
          </v-flex>
        </v-layout>

      </v-toolbar>
    </v-layout>

    <!-- Mobile -->
    <v-layout class="hidden-sm-and-up">
      <v-toolbar v-if="!displayNav" fixed app>
        <v-layout row justify-start align-center>
          <v-flex xs4>
            <v-avatar @click="openNav" class="cyan cursor">
              <span class="white--text headline small-caps">{{ userInitials }}</span>
            </v-avatar>
          </v-flex>
          <v-flex xs8>
            <v-layout row justify-end align-center>
              <v-btn v-if="!authenticated" @click='signUp' color='secondary'>Sign up</v-btn>
              <v-btn v-if="!authenticated" @click='logIn' color='primary'>Log in</v-btn>
              <v-btn v-if="authenticated" @click='logOut' color='secondary'>Log out</v-btn>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-toolbar>
      <v-navigation-drawer fixed stateless dark class="blue" v-if="displayNav" :value="displayNav" v-on-clickaway="closeNav" app>
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
    </v-layout>
  </v-layout>
</template>

<script>
import { directive as onClickaway } from 'vue-clickaway'
import { mapGetters, mapState, mapMutations } from 'vuex'

import { auth } from '~/services/firebaseService'

export default {
  directives: {
    onClickaway
  },

  props: ['display'],

  data () {
    return {
      items: [
        { icon: 'home', title: 'Home', link: '/', showSmAndUp: true },
        { icon: 'store', title: 'Buy', link: '/marketplace', showSmAndUp: true },
        { icon: 'view_quilt', title: 'Sell', link: '/policies', showSmAndUp: true },
        { icon: 'help', title: 'FAQ', link: '/faq', showSmAndUp: false },
        { icon: 'settings', title: 'Settings', link: '/settings', showSmAndUp: true }
      ]
    }
  },

  computed: {
    ...mapGetters([
      'userInitials',
      'authenticated'
    ]),

    ...mapState([
      'user'
    ]),

    displayNav () {
      return this.display // Need computed property because props cant be mutated
    }
  },

  methods: {
    ...mapMutations({
      openNav: 'OPEN_NAV',
      closeNav: 'CLOSE_NAV',
      showSnackbar: 'SHOW_SNACKBAR'
    }),

    navigateTo (link) {
      this.$router.push(link)
    },

    logIn () {
      this.$router.push('/login')
    },

    signUp () {
      this.$router.push('/signup')
    },

    logOut () {
      auth.signOut()
        .then(() => {
          this.showSnackbar({
            color: 'success',
            message: 'You have logged out!'
          })

          return this.$axios.$get('/endUserSession')
        })
    }
  }
}
</script>

<style lang="stylus" scoped>

.cursor {
  cursor: pointer;
}

</style>

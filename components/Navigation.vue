<template>
  <v-layout>
    <v-toolbar v-if="!displayNav" fixed app>
      <v-avatar @click="openNav" class="cyan cursor ma-3">
        <span class="white--text headline small-caps">{{ userInitials }}</span>
      </v-avatar>
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
</template>

<script>
import { directive as onClickaway } from 'vue-clickaway'
import { mapGetters, mapMutations } from 'vuex'

export default {
  directives: {
    onClickaway
  },

  props: ['display'],

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
    ...mapGetters([
      'userInitials'
    ]),

    displayNav () {
      return this.display // Need computed property because props cant be mutated
    }
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

<style lang="stylus" scoped>

.cursor {
  cursor: pointer;
}

</style>

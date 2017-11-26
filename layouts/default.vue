<template>
  <v-app light>
    <v-toolbar v-if="!displayNav" fixed app>
      <v-avatar @click="openNav" class="cyan cursor ma-3">
        <span class="white--text headline">S</span>
      </v-avatar>
    </v-toolbar>
    <v-navigation-drawer fixed stateless dark class="blue" v-if="displayNav" :value="displayNav" v-on-clickaway="closeNav"app>
      <v-list>
        <v-list-tile v-for="item in items" :key="item.title">
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-content>
      <nuxt />
    </v-content>
  </v-app>
</template>

<script>
import { directive as onClickaway } from 'vue-clickaway'
import { mapState, mapMutations } from 'vuex'

export default {
  directives: {
    onClickaway
  },

  data () {
    return {
      items: [
        { icon: '', title: 'Marketplace' },
        { icon: '', title: 'My Policies' },
        { icon: '', title: 'FAQ' },
        { icon: '', title: 'Settings' }
      ]
    }
  },

  computed: {
    ...mapState([
      'displayNav'
    ])
  },

  methods: {
    ...mapMutations({
      openNav: 'OPEN_NAV',
      closeNav: 'CLOSE_NAV'
    })
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

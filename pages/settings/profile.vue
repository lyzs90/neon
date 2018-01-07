<template>
  <v-card class="w-100">
    <v-card-media :src="require('~/assets/ali.png')" height="300px">
      <v-layout column class="media">
        <v-card-title>
          <v-btn dark icon>
            <v-icon>chevron_left</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn dark icon class="mr-3">
            <v-icon>edit</v-icon>
          </v-btn>
          <v-btn dark icon>
            <v-icon>more_vert</v-icon>
          </v-btn>
        </v-card-title>
        <v-spacer></v-spacer>
        <v-card-title class="white--text pl-5 pt-5">
          <div class="display-1 pl-5 pt-5">{{ user.account.displayName }}</div>
        </v-card-title>
      </v-layout>
    </v-card-media>
    <v-list two-line>

      <v-list-tile>
        <v-list-tile-action>
          <v-icon color="blue">mail</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>{{ user.account.email }}</v-list-tile-title>
          <v-list-tile-sub-title>Email</v-list-tile-sub-title>
        </v-list-tile-content>
        <v-list-tile-action>
          <v-btn icon ripple>
            <v-icon>edit</v-icon>
          </v-btn>
        </v-list-tile-action>
      </v-list-tile>

      <v-divider inset></v-divider>

      <v-list-tile>
        <v-list-tile-action>
          <v-icon color="blue">phone</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>{{ user.account.phoneNumber }}</v-list-tile-title>
          <v-list-tile-sub-title>Mobile</v-list-tile-sub-title>
        </v-list-tile-content>
        <v-list-tile-action>
          <v-btn icon ripple>
            <v-icon>edit</v-icon>
          </v-btn>
        </v-list-tile-action>
      </v-list-tile>

    </v-list>

    <v-btn @click="updateProfile">Update Profile</v-btn>
  </v-card>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

import { auth } from '~/services/firebaseService'

export default {
  computed: {
    ...mapState([
      'user'
    ])
  },

  methods: {
    ...mapMutations({
      showSnackbar: 'SHOW_SNACKBAR'
    }),

    updateProfile () {
      const user = auth.currentUser
      return user.updateProfile({
        photoURL: 'test'
      })
        .then(() => {
          this.showSnackbar({
            color: 'success',
            message: 'Profile updated!'
          })
        })
        .catch(err => {
          console.log(err)
          this.showSnackbar({
            color: 'error',
            message: 'Server error'
          })
        })
    }
  }
}
</script>

<style lang="css">
</style>

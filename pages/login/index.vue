<template lang='html'>
  <v-container fluid fill-height>
    <v-layout flex align-center justify-center>
      <v-flex class='text-xs-center'>
        <div id='firebaseui-auth-container'></div>
        <div id='loader'>Loading...</div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import firebase from 'firebase'
import { auth } from '~/services/firebaseService'

// Import only on clientside, not during SSR
if (process.browser) {
  require('firebaseui')
}

export default {
  name: 'login',

  mounted () {
    // Checks if ui instance already exists
    const existingInstance = firebaseui.auth.AuthUI.getInstance()
    const uiConfig = {
      callbacks: {
        uiShown: function () {
          document.getElementById('loader').style.display = 'none'
        }
      },
      signInSuccessUrl: 'http://localhost:3000/',
      signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID
      ],
      credentialHelper: firebaseui.auth.CredentialHelper.NONE
    }
    const ui = existingInstance || new firebaseui.auth.AuthUI(auth)
    ui.start('#firebaseui-auth-container', uiConfig)
  }
}
</script>

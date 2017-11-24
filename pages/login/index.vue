<template lang="html">
  <v-container fluid fill-height>
    <v-layout flex align-center justify-center>
      <v-flex class="text-xs-center">
        <div id="firebaseui-auth-container"></div>
        <div id="loader">Loading...</div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import firebase from 'firebase'

// Import only on clientside, not during SSR
if (process.browser) {
  require('firebaseui')
}

export default {
  name: 'login',
  mounted () {
    const uiConfig = {
      callbacks: {
        uiShown: function () {
          document.getElementById('loader').style.display = 'none'
        }
      },
      signInSuccessUrl: '/',
      signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID
      ],
      credentialHelper: firebaseui.auth.CredentialHelper.NONE
    }
    const ui = new firebaseui.auth.AuthUI(firebase.auth())
    ui.start('#firebaseui-auth-container', uiConfig)
  }
}
</script>

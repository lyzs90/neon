<template>
  <v-snackbar
    :timeout=6000
    :color="color"
    :top="true"
    :right="true"
    :value="displaySnackbar"
  >
    {{ text }}
    <v-btn flat @click.native="closeSnackbar">Close</v-btn>
  </v-snackbar>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  props: ['display', 'color', 'text'],

  computed: {
    displaySnackbar () {
      return this.display // Need computed property because props cant be mutated
    }
  },

  methods: {
    ...mapMutations({
      closeSnackbar: 'CLOSE_SNACKBAR'
    })
  }
}
</script>

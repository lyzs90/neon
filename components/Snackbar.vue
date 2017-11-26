<template>
  <v-snackbar
    :timeout=6000
    :color="color"
    :top="true"
    :right="true"
    v-model="displaySnackbar"
  >
    {{ text }}
    <v-btn flat @click.native="closeSnackbar">Close</v-btn>
  </v-snackbar>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  props: ['color', 'text'],

  computed: {
    ...mapState([
      'displaySnackbar'
    ])
  },

  methods: {
    ...mapMutations({
      closeSnackbar: 'CLOSE_SNACKBAR'
    })
  }
}
</script>

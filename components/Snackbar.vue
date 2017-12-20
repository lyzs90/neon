<template>
  <v-snackbar
    :timeout=6000
    :color="color"
    :top="true"
    :right="true"
    v-model="display"
  >
    {{ text }}
    <v-btn flat @click.native="closeSnackbar">Close</v-btn>
  </v-snackbar>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  props: ['display', 'color', 'text'],

  methods: {
    ...mapMutations({
      closeSnackbar: 'CLOSE_SNACKBAR'
    })
  }
}
</script>

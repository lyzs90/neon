<template>
  <v-container fluid h-100>
    <v-layout row justify-center align-center h-100>
      <offer-form></offer-form>
    </v-layout>
  </v-container>
</template>

<script>
import OfferForm from '~/components/OfferForm'

export default {
  components: {
    OfferForm
  }
}
</script>

<style lang="css">
</style>

<template>
  <v-container fluid h-100 ma-3>
    <v-layout column justify-start>
      <h2>My Offers</h2>
      <br />
      <h5 :class="{'w-50': $vuetify.breakpoint.smAndUp}">Offers are advertisements to buy or sell Ether, which are pegged to external market exchange rates. As a market maker, you pay X% of escrow fees.</h5>
      <br />
      <v-btn class="ml-0 btn--normal" color="primary" @click.native="toggleOfferModal">
        Create New Offer
      </v-btn>
    </v-layout>

    <!-- OfferModal -->
    <v-dialog v-model="displayOfferModal" max-width="500">
      <v-layout row justify-center align-center h-100>
        <offer-form v-on:close="toggleOfferModal"></offer-form>
      </v-layout>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import { isEmpty, some } from 'lodash'
import { db } from '~/services/firebaseService'

import OfferForm from '~/components/OfferForm'

export default {
  components: {
    OfferForm
  },

  created () {
    this.$store.commit('TOGGLE_MAIN_SPINNER')

    // Set up listener if it doesnt already exist
    if (!some(this.listeners, { name: 'user_buy_offers' })) {
      const unsubscribe = db.collection('buy_offers')
        .where('user_id', '==', this.$store.getters.userID)
        .onSnapshot(querySnapshot => {
          console.log('snapshot')
          // TODO: when writing, 'server' means changes have been propogated to db. local means changes are still local. can implement a spinner
          // let source = querySnapshot.metadata.hasPendingWrites ? 'Local' : 'Server'

          querySnapshot.forEach(doc => {
            this.$store.commit('SET_PENDING_OFFER', {
              id: doc.id,
              ...doc.data()
            })
          })
        })

      this.$store.commit('SET_LISTENER', {
        unsubscribe,
        name: 'user_buy_offers'
      })
    }

    this.$store.commit('TOGGLE_MAIN_SPINNER')
  },

  beforeDestroy () {
    this.listeners['user_buy_offers'].unsubscribe()
    this.$store.commit('REMOVE_LISTENER', 'user_buy_offers')
  },

  data () {
    return {
      displayOfferModal: false
    }
  },

  computed: {
    ...mapState([
      'offers',
      'listeners'
    ]),

    noPendingOffers () {
      return isEmpty(this.offers.pending)
    }
  },

  methods: {
    toggleOfferModal () {
      this.displayOfferModal = !this.displayOfferModal
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>

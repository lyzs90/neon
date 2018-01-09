<template>
  <v-container fluid h-100 :class="{'ma-3': $vuetify.breakpoint.smAndUp}">
    <v-layout column justify-start>
      <h2>My Offers</h2>
      <br />
      <h5 :class="{'w-50': $vuetify.breakpoint.smAndUp}">Offers are advertisements to buy or sell Ether, which are pegged to external market exchange rates. As a market maker, you pay X% of escrow fees.</h5>
      <br />
      <v-btn class="ml-0 btn--normal" color="primary" @click.native="toggleOfferModal">
        Create New Offer
      </v-btn>
      <br />

      <!-- My Offers -->
      <v-checkbox label="View Completed" v-model="displayCompleted" light></v-checkbox>

      <v-flex xs12 sm6>
        <v-card>
          <v-card-media
            class="white--text"
            height="200px"
            :src="blockiesImg"
          >
            <v-container fill-height fluid>
              <v-layout fill-height>
                <v-flex xs12 align-end flexbox>
                  <span class="headline">{{ offers.pending[0] && offers.pending[0].offer_type }}</span>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-media>
          <v-card-title>
            <div>
              <span class="grey--text">Number 10</span><br>
              <span>Whitehaven Beach</span><br>
              <span>Whitsunday Island, Whitsunday Islands</span>
            </div>
          </v-card-title>
          <v-card-actions>
            <v-btn flat color="orange">Share</v-btn>
            <v-btn flat color="orange">Explore</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>

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
import { mapState, mapGetters } from 'vuex'
import { isEmpty, some } from 'lodash'

import { db } from '~/services/firebaseService'
import OfferForm from '~/components/OfferForm'

export default {
  components: {
    OfferForm
  },

  asyncData ({ app, store }, callback) {
    return app.$axios.$get(`/image/${store.getters.userImage}`, {
      params: {
        folder: 'blockies'
      }
    })
      .then(imgData => {
        callback(null, { blockiesImg: imgData })
      })
      .catch(err => {
        console.log(err.response)
      })
  },

  created () {
    this.$store.commit('TOGGLE_MAIN_SPINNER')

    // Set up listener if it doesnt already exist
    if (!this.$isServer && !some(this.listeners, { name: 'user_buy_offers' })) {
      const unsubscribe = db.collection('buy_offers')
        .where('user_id', '==', this.$store.getters.userID)
        .onSnapshot(querySnapshot => {
          // TODO: when writing, 'server' means changes have been propogated to db. local means changes are still local. can implement a spinner
          // let source = querySnapshot.metadata.hasPendingWrites ? 'Local' : 'Server'

          const pendingOffers = []
          querySnapshot.forEach(doc => {
            pendingOffers.push({
              id: doc.id,
              ...doc.data()
            })
          })
          this.$store.commit('SET_PENDING_OFFERS', pendingOffers)
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
      displayOfferModal: false,
      displayCompleted: false
    }
  },

  computed: {
    ...mapState([
      'offers',
      'listeners'
    ]),

    ...mapGetters([
      'userID'
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

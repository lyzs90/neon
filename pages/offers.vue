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

      <v-flex xs12 sm6 v-for="offer in offers.pending" :key="offer.id">
        <v-card>
          <v-card-title primary-title class="row justify-center">
            <div>
              <h6 class="title">{{ offer.id }}</h6>
            </div>
          </v-card-title>
          <v-card-media height="200px">
            <v-layout row align-center>
              <!-- Offeror -->
              <v-flex xs6 column align-center>
                <v-avatar>
                  <img :src="blockiesImg">
                </v-avatar>
                <div class="f6 pa-1 w-50 truncate">{{ offer.user_id }}</div>
              </v-flex>

              <!-- Offeree -->
              <v-flex xs6 column align-center>
                <v-avatar>
                  <img :src="offer.offeree_photo">
                </v-avatar>
                <div class="f6 pa-1 w-50 truncate">{{ offer.offeree_id }}</div>
              </v-flex>

            </v-layout>
          </v-card-media>
          <v-card-actions class="row justify-center ma-3">
            <v-btn class="white--text" color="green">Accept</v-btn>
            <v-btn class="white--text" color="red">Reject</v-btn>
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
import Promise from 'bluebird'

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
          return Promise.map(pendingOffers, offer => {
            return this.$axios.$get(`/user/${offer.offeree_id}`)
              .then(offeree => {
                return this.$axios.$get(`/image/${offeree.photoUrl}`, {
                  params: {
                    folder: 'blockies'
                  }
                })
              })
              .then(imgData => {
                offer.offeree_photo = imgData

                return offer
              })
          })
            .then(populatedOffers => {
              this.$store.commit('SET_PENDING_OFFERS', populatedOffers)
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

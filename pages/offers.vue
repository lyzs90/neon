<template>
  <v-container fluid h-100 :class="{'ma-3': $vuetify.breakpoint.smAndUp}" v-cloak>
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

      <v-container fluid :class="{'grid-list-xl': $vuetify.breakpoint.smAndUp}">
        <v-layout row wrap>

          <v-flex xs12 sm3 v-for="offer in offers.pending" :key="offer.id">
            <v-card class="w-100" :class="{'mb-3': $vuetify.breakpoint.xsOnly}">
              <v-card-title primary-title class="row justify-center">
                <div>
                  <h5 class="headline">{{ offer.offer_type }}</h5>
                  <div>{{ offer.quantity }} units</div>
                  <div>${{  formatPrice(offer.unit_price) }}</div>
                </div>
              </v-card-title>
              <v-card-media height="150px">
                <br />
                <v-layout class="offer__card__width" column justify-space-around>
                  <!-- Offeror -->
                  <v-flex xs10 offset-xs2 align-center>
                    <v-avatar>
                      <img :src="blockiesImg">
                    </v-avatar>
                    <div class="f6 pa-1 truncate">{{ offer.user_id }}</div>
                  </v-flex>

                  <!-- Offeree -->
                  <v-flex xs12 offset-xs2 align-center>
                    <v-avatar :class="{'grey darken-3': !offer.offeree_photo}">
                      <img :src="offer.offeree_photo">
                    </v-avatar>
                    <div class="f6 pa-1 truncate">{{ offer.offeree_id || 'Waiting for buyer/seller...' }}</div>
                  </v-flex>
                </v-layout>
                <br />
              </v-card-media>
              <v-divider></v-divider>
              <v-card-actions class="row justify-center ma-3">
                <v-btn class="white--text" color="green">Accept</v-btn>
                <v-btn class="white--text" color="red">Reject</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>

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
import { isNil, isEmpty, some } from 'lodash'
import Promise from 'bluebird'

import { db } from '~/services/firebaseService'
import OfferForm from '~/components/OfferForm'

export default {
  components: {
    OfferForm
  },

  asyncData ({ app, store }, callback) {
    store.commit('TOGGLE_MAIN_SPINNER')
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
      .finally(() => {
        store.commit('TOGGLE_MAIN_SPINNER')
      })
  },

  created () {
    // Set up listener if it doesnt already exist
    if (!this.$isServer && !some(this.listeners, { name: 'user_offers' })) {
      const unsubscribe = db.collection('offers')
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
            if (isNil(offer.offeree_id)) {
              return offer
            }

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
        name: 'user_offers'
      })
    }
  },

  beforeDestroy () {
    this.listeners['user_offers'].unsubscribe()
    this.$store.commit('REMOVE_LISTENER', 'user_offers')
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
    },

    formatPrice (value) {
      let val = (value / 1).toFixed(2)
      return val.toString()
    }
  }
}
</script>

<style lang="stylus" scoped>

.offer__card__width
  max-width: 280px

</style>

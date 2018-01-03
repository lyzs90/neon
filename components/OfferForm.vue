<template>
  <v-card class="card__offer">
    <v-toolbar color="grey lighten-1" dark>

      <!-- Offer Type -->
      <v-toolbar-title>
        <v-menu offset-y>
          <v-btn color="secondary" dark slot="activator">{{ offerSelect }}</v-btn>
          <v-list>
            <v-list-tile v-for="item in offerItems" :key="item.title" @click="selectOfferOption(item)">
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <!-- Market Price -->
      <v-tooltip top>
        <v-badge slot="activator" color="secondary" class="mr-4">
          <span slot="badge">!</span>
          <span class="pa-1">S${{ marketPrice }}</span>
        </v-badge>
        <span>Average market price</span>
      </v-tooltip>
    </v-toolbar>

    <v-form v-model="valid" class="pa-3">

      <!-- User ID -->
      <v-layout row justify-start align-baseline>
        <v-text-field
          label="User ID (optional)"
          v-model="userID"
          hint="Send a private offer to someone you know"
        ></v-text-field>
      </v-layout>

      <!-- Units -->
      <v-layout row justify-start align-baseline>
        <v-btn color="grey darken-1" class="white--text btn__offer" @click.native="setMaxQuantity">Max</v-btn>
        <v-text-field
          label="Quantity"
          v-model="units"
          :rules="quantityRules"
          required
        ></v-text-field>
      </v-layout>

      <!-- Unit Price -->
      <v-layout row justify-start align-baseline>
        <v-menu offset-y>
          <v-btn color="grey darken-1" class="btn__offer" dark slot="activator">{{ priceSelect }}</v-btn>
          <v-list>
            <v-list-tile v-for="item in priceItems" :key="item.title" @click="selectPriceOption(item)">
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
        <v-text-field
          label="Unit Price (S$)"
          v-model="unitPrice"
          :rules="currencyRules"
          required
        ></v-text-field>
      </v-layout>

      <!-- Duration -->
      <v-layout row justify-start align-baseline>
        <v-btn color="grey darken-1" class="white--text btn__offer" @click.native="setMaxDuration">Max</v-btn>
        <v-text-field
          label="Duration (min)"
          v-model="duration"
          :rules="durationRules"
          required
        ></v-text-field>
      </v-layout>

      <!-- Total Price -->
      <v-layout row justify-start align-baseline>
        <v-btn disabled outline class="btn__offer not-allowed">Total</v-btn>
        <v-text-field
          label="S$"
          v-model="totalPrice"
          max="10"
          :rules="currencyRules"
          required
        ></v-text-field>
      </v-layout>

      <v-btn class="right ma-3" color="primary" @click.native="submit">Submit</v-btn>
    </v-form>
  </v-card>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'

export default {
  data () {
    return {
      marketPrice: 698,

      // User ID
      userID: '',

      // Offer Type
      offerItems: [
        { title: 'Buy Ether' },
        { title: 'Sell Ether' }
      ],
      offerSelect: 'Buy Ether',

      // Quantity
      valid: false,
      units: '0.0000000000',
      quantityRules: [
        (v) => !!v || 'No. of units is required',
        (v) => /^\d+(\.\d{1,10})?$/.test(v) || 'No. of units must be valid'
      ],

      // Unit Price
      priceSelect: 'Price',
      priceItems: [
        { title: 'Last' },
        { title: 'Bid' },
        { title: 'Ask' }
      ],
      unitPrice: '0.0000000000',
      currencyRules: [
        (v) => !!v || 'Price is required',
        (v) => /^\d+(\.\d{1,10})?$/.test(v) || 'Price must be valid'
      ],

      // Time in Force
      duration: 30,
      durationRules: [
        (v) => !!v || 'Duration is required',
        (v) => /^\d+$/.test(v) || 'Duration must be valid',
        (v) => v <= 1440 || 'Max duration is 24hrs',
        (v) => v >= 30 || 'Min duration is 30min'
      ],

      tempTotalPrice: 0
    }
  },

  computed: {
    totalPrice: {
      get: function () {
        if (parseInt(this.units) === 0 || parseInt(this.unitPrice) === 0) {
          return '0.0000000000'
        }

        return Math.round(this.units * this.unitPrice * 10000000000) / 10000000000
      },

      set: function (newValue) {
        this.tempTotalPrice = newValue
        return newValue
      }
    }
  },

  methods: {
    ...mapActions({
      emailLogin: 'signInWithEmail'
    }),

    ...mapMutations({
      showSnackbar: 'SHOW_SNACKBAR'
    }),

    selectOfferOption (item) {
      this.offerSelect = item.title
    },

    selectPriceOption (item) {
      switch (item.title) {
        case 'Last':
          this.unitPrice = this.marketPrice
          break

        case 'Bid':
          this.unitPrice = this.marketPrice - 5
          break

        case 'Ask':
          this.unitPrice = this.marketPrice + 5
          break
      }

      this.priceSelect = item.title
    },

    setMaxQuantity () {
      this.units = Math.round(this.tempTotalPrice / this.unitPrice * 10000000000) / 10000000000
    },

    setMaxDuration () {
      this.duration = 1440
    },

    submit () {
      this.showSnackbar({
        color: 'success',
        message: 'Your offer has been placed!'
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.card__offer
  max-width: 500px
  width: 100%

.btn__offer
  width: 105px
</style>

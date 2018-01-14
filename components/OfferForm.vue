<template>
  <v-card class="w-100">

    <v-toolbar color="blue lighten-1" dark>
      <v-toolbar-title>Make Offer</v-toolbar-title>
    </v-toolbar>

    <v-stepper vertical v-model="step">

      <!-- Step 1 -->
      <v-stepper-step step="1" :complete="step > 1">Details</v-stepper-step>
      <v-stepper-content step="1">
        <v-form v-model="valid" ref="form" class="pa-3">
          <!-- Offer Type -->
          <v-layout row justify-space-between align-baseline>
            <v-menu offset-y>
              <v-btn color="grey darken-1" dark slot="activator">{{ offerSelect }}</v-btn>
              <v-list>
                <v-list-tile v-for="item in offerItems" :key="item.title" @click="selectOfferOption(item)">
                  <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-menu>

            <!-- Market Price -->
            <v-tooltip top>
              <v-badge slot="activator" color="secondary" class="mr-4">
                <span slot="badge">!</span>
                <span class="pa-1">S${{ marketPrice }}</span>
              </v-badge>
              <span>Average market price</span>
            </v-tooltip>
          </v-layout>

          <!-- Total Price -->
          <v-layout row justify-start align-baseline>
            <v-text-field
              label="S$"
              v-model="totalPrice"
              max="10"
              :rules="currencyRules"
              required
            ></v-text-field>
          </v-layout>

          <!-- Duration -->
          <v-layout row justify-start align-baseline>
            <v-text-field
              label="Duration (min)"
              v-model="duration"
              :rules="durationRules"
              required
            ></v-text-field>
            <v-btn color="grey darken-1" class="white--text btn__offer ma-3" @click.native="setMaxDuration">Max</v-btn>
          </v-layout>

          <!-- Offeree ID -->
          <v-layout row justify-start align-baseline>
            <v-text-field
              label="User ID (optional)"
              v-model="offereeID"
              hint="Send a private offer to someone you know"
            ></v-text-field>
          </v-layout>

          <v-btn class="right ma-3 btn__offer" color="secondary" @click.native="step = 2" :disabled="!valid">Next</v-btn>
        </v-form>
      </v-stepper-content>

      <!-- Step 2 -->
      <v-stepper-step step="2" :complete="step > 2">Confirmation</v-stepper-step>
      <v-stepper-content step="2">
        <v-layout column justify-center align-start>
          <span>Type: {{  offerSelect }}</span>
          <span>Total Price: S${{ totalPrice }}</span>
          <span>Units: {{ units }}</span>
          <span>Duration: {{ duration }}</span>
          <span>Offered To: {{ offereeID || 'Everyone' }}</span>
        </v-layout>

        <v-layout row justify-end align-baseline>
          <v-btn class="right ma-3 btn__offer" color="secondary" @click.native="step = 1">Back</v-btn>
          <v-btn class="right ma-3 btn__offer" color="primary" @click.native="submit" :disabled="!valid">
            {{ buttonSpinner.display ? '' : 'Submit' }}
            <v-progress-circular v-if="buttonSpinner.display" indeterminate color="white" size="25"></v-progress-circular>
          </v-btn>
        </v-layout>
      </v-stepper-content>

    </v-stepper>

  </v-card>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { extend } from 'lodash'

export default {
  data () {
    return {
      step: 0,
      valid: false,
      marketPrice: 698,

      // Offer Type
      offerItems: [
        { title: 'Buy Ether' },
        { title: 'Sell Ether' }
      ],
      offerSelect: 'Buy Ether',

      // Total Price
      totalPrice: '0.00',
      currencyRules: [
        (v) => !!v || 'Price is required',
        (v) => /^\d+(\.\d{1,2})?$/.test(v) || 'Price must be valid'
      ],

      // Time in Force
      duration: 30,
      durationRules: [
        (v) => !!v || 'Duration is required',
        (v) => /^\d+$/.test(v) || 'Duration must be valid',
        (v) => v <= 1440 || 'Max duration is 24hrs',
        (v) => v >= 30 || 'Min duration is 30min'
      ],

      // Offeree ID
      offereeID: ''
    }
  },

  computed: {
    ...mapState([
      'buttonSpinner'
    ]),

    units () {
      return this.totalPrice / this.marketPrice
    }
  },

  methods: {
    ...mapActions({
      createOffer: 'createOffer'
    }),

    ...mapMutations({
      setPendingOffer: 'SET_PENDING_OFFER'
    }),

    selectOfferOption (item) {
      this.offerSelect = item.title
    },

    setMaxDuration () {
      this.duration = 1440
    },

    submit () {
      if (this.$refs.form.validate()) {
        const payload = {
          offer_type: this.offerSelect,
          quantity: this.units,
          unit_price: this.marketPrice,
          duration: this.duration,
          total_price: this.totalPrice
        }

        if (this.offereeID !== '') {
          extend(payload, { offeree_id: this.offereeID })
        }

        return this.createOffer(payload)
          .then(() => {
            this.$refs.form.reset()
            this.step = 0
            this.$emit('close')
          })
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.btn__offer
  width: 105px
  max-height: 36px
</style>

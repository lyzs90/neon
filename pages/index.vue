<template>
  <v-layout column justify-center align-center>

    <!-- Hero -->
    <section class="w-100">
      <v-parallax :src="require('~/assets/bg1.png')" height="600" jumbotron>
        <v-layout column justify-center align-center>
          <logo/>
          <h1 class="title grey--text text--darken-1">
            A p2p ether portal
          </h1>
          <h2 class="subtitle grey--text text--darken-1">
            neon
          </h2>
        </v-layout>
      </v-parallax>
    </section>

    <!-- Features -->
    <section>
      <v-layout column wrap class="my-5" align-center>
        <v-flex xs12 class="my-3">
          <div class="text-xs-center">
            <h2 class="headline">The easiest way to swap ether and fiat with your peers</h2>
            <span class="subheading">
              No limits, no fees, no worries
            </span>
          </div>
        </v-flex>
        <v-flex xs12>
          <v-container grid-list-xl>
            <v-layout row wrap align-start>
              <v-flex xs12 md4>
                <v-card class="elevation-0 transparent">
                  <v-card-text class="text-xs-center">
                    <v-icon x-large class="blue--text text--lighten-2">thumbs_up_down</v-icon>
                  </v-card-text>
                  <v-card-title primary-title class="layout justify-center">
                    <div class="headline text-xs-center">Trustless</div>
                  </v-card-title>
                  <v-card-text>
                    <p>A fiat escrow, powered by Stripe, is used together with an ether escrow (Ethereum smart contract) to guarantee simultaneous release of funds.</p>
                    <p>Buyers and sellers do not have to trust each other to make a transaction -- they just have to trust in the contract.</p>
                  </v-card-text>
                </v-card>
              </v-flex>
              <v-flex xs12 md4>
                <v-card class="elevation-0 transparent">
                  <v-card-text class="text-xs-center">
                    <v-icon x-large class="blue--text text--lighten-2">local_atm</v-icon>
                  </v-card-text>
                  <v-card-title primary-title class="layout justify-center">
                    <div class="headline">Safe Transactions</div>
                  </v-card-title>
                  <v-card-text>
                    <p><b>neon</b> does not hold your fiat or ether. Fiat is paid through Stripe; Ether is sent directly into the smart contract.</p>
                    <p>Payouts are triggered when both parties confirm the release of funds on <b>neon</b>. If either party cancels, funds are immediately returned to their respective owners.</p>
                  </v-card-text>
                </v-card>
              </v-flex>
              <v-flex xs12 md4>
                <v-card class="elevation-0 transparent">
                  <v-card-text class="text-xs-center">
                    <v-icon x-large class="blue--text text--lighten-2">mood</v-icon>
                  </v-card-text>
                  <v-card-title primary-title class="layout justify-center">
                    <div class="headline text-xs-center">Convenient</div>
                  </v-card-title>
                  <v-card-text>
                    No more physical meetups or hair-raising bank transfers. Swap fiat for Ether anywhere, any time.
                  </v-card-text>
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>
        </v-flex>
      </v-layout>
    </section>

    <!-- Hero 2 -->
    <section class="w-100">
      <v-parallax :src="require('~/assets/bg2.png')" height="550" jumbotron>
        <v-layout column align-center justify-center>
          <div class="headline grey--text text--darken-1 mb-3 text-xs-center">Ever wondered why it is so difficult to buy and sell Ether?</div>
          <em class="grey--text text--darken-1">It's not anymore</em>
          <v-btn
            class="primary mt-5"
            dark
            large
            href="/"
          >
           Get Started
          </v-btn>
        </v-layout>
      </v-parallax>
    </section>

    <!-- Contact -->
    <section>
      <v-container grid-list-xl>
        <v-layout row wrap justify-center class="my-5">
          <v-flex xs12 sm4>
            <v-card class="elevation-0 transparent">
              <v-card-title primary-title class="layout justify-center">
                <div class="headline">About neon</div>
              </v-card-title>
              <v-card-text>
                neon is the world's first semi-decentralised, peer-to-peer portal that enables safe exchange between fiat and Ether.
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex xs12 sm4 offset-sm1>
            <v-card class="elevation-0 transparent">
              <v-card-title primary-title class="layout justify-center">
                <div class="headline">Contact us</div>
              </v-card-title>
              <v-card-text>
                We'd love to hear from you — whether it be for a website issue, feature request or question.
              </v-card-text>
              <v-list class="transparent">
                <v-list-tile>
                  <v-list-tile-action>
                    <v-icon class="blue--text text--lighten-2">phone</v-icon>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title>777-867-5309</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-action>
                    <v-icon class="blue--text text--lighten-2">place</v-icon>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title>Singapore</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-action>
                    <v-icon class="blue--text text--lighten-2">email</v-icon>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title>help@neon.com</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </section>

    <!-- Footer -->
    <v-footer class="grey lighten-3 w-100">
      <v-layout row wrap justify-end>
        <div class="grey--text text--darken-1 mr-3">
          neon, 2018
        </div>
      </v-layout>
    </v-footer>

  </v-layout>
</template>

<script>
import Logo from '~/components/Logo.vue'

export default {
  components: {
    Logo
  }
}
</script>

<style>
.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; /* 1 */
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}
</style>

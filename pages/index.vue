<template>
  <v-layout>
    <section class="container">
      <div>
        <logo/>
        <h1 class="title">
          p2p ether portal
        </h1>
        <h2 class="subtitle">
          ethersupply
        </h2>
        <h5>
          swap ether and fiat directly with people like you. use Stripe-powered fiat escrow and decentralized Ethereum-powered escrow to guarantee simultaneous release of funds and ether.
        </h5>
        <br />
        <h5>
          trade with convenience and safety.
        </h5>
      </div>
    </section>
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
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

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

.links {
  padding-top: 15px;
}
</style>

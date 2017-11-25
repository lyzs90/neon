export default function ({ store, redirect, route }) {
  if (!store.getters.authenticated && route.name !== 'login') {
    // issue: middleware is run when store is at base state
  }
}

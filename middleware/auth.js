export default function ({ store, app }) {
  if (store.getters.authenticated) {
    app.router.push({ name: 'index' })
  }
  app.router.push({ name: 'login' })
}

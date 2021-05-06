<template>
  <v-app>

    <v-app-bar
      app
      color="primary"
      dark
    >
      <v-btn to="/" text>Catalog Verifiable Credentials Demo</v-btn>
      <v-spacer></v-spacer>

      <v-toolbar-items>
        <v-btn color="primary" to="/inbox" depressed>
          <v-badge
            color="secondary"
            :value="0">
            <span slot="badge">0</span>
            <v-icon>mdi-email</v-icon>
          </v-badge>
        </v-btn>
      </v-toolbar-items>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
    </v-app-bar>

      <v-navigation-drawer v-model="drawer" app>
          <v-list>
                <v-list-item link to="/keys">
                    <v-icon>mdi-key</v-icon><p>&nbsp;</p>
                    <v-list-item-title>Manage Key Pair</v-list-item-title>
                </v-list-item>
          </v-list>
      </v-navigation-drawer>

    <v-main class="ma-5">
      <nuxt />
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  components: {
  },

  data: () => ({
    drawer: null
  })

}
</script>

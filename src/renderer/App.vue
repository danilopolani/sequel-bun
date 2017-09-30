<template>
  <div id="app">
    <div class="is-overlay global" v-if="loading">
      <div class="hero is-fullheight">
        <div class="hero-body">
          <div class="is-block-centered">
            <div class="loader is-block-centered"></div>
            <h3 class="is-block-centered">{{ loadingText }}</h3>
          </div>
        </div>
      </div>
    </div>

    <div class="columns" id="top-bar">
      <div class="column is-one-quarter padding-left">
        <div class="select">
          <select v-model="connection.i">
            <option value="-1" disabled>Choose connection</option>
            <option v-for="(conn, i) in connections" :value="i" :key="i">{{ conn.name }}</option>
          </select>
        </div>
      </div>
      <div class="column no-padding-left">
        <div class="tabs is-toggle">
          <ul>
            <router-link to="/connected" :disabled="navigationDisabled('connected') === ''" :class="{'is-active': active('connected')}" :event="navigationDisabled('connected')">
              <img src="static/toolbar-switch-to-structure.png" alt="Switch to Structure">
              Structure
            </router-link>
            <router-link to="/connected/content" :disabled="navigationDisabled('content') === ''" :class="{'is-active': active('content')}" :event="navigationDisabled('content')">
              <img src="static/toolbar-switch-to-browse.png" alt="Switch to Content">
              Content
            </router-link>
            <router-link to="/connected/relations" :disabled="navigationDisabled('relations') === ''" :class="{'is-active': active('relations')}" :event="navigationDisabled('relations')">
              <img src="static/toolbar-switch-to-table-relations.png" alt="Switch to Relations">
              Relations
            </router-link>
            <router-link to="/connected/sql" :disabled="navigationDisabled('sql') === ''" :class="{'is-active': active('sql')}" :event="navigationDisabled('sql')">
              <img src="static/toolbar-switch-to-sql.png" alt="Switch to SQL">
              Query
            </router-link>
          </ul>
        </div>
      </div>
    </div>

    <router-view ref="router"></router-view>
  </div>
</template>

<script>
  import Connection from './services/Connection'

  export default {
    name: 'sequel-bun',
    data () {
      return {
        loading: false,
        loadingText: '',
        connection: { // Current connection
          i: -1,
          ref: null
        },
        db: null, // Current db
        connections: [], // Saved connections
        table: null // Current table
      }
    },
    methods: {
      /**
       * Check if current item is active
       *
       * @param {string} path
       */
      active (path) {
        return this.$route.name === path
      },

      /**
       * Check if enable navigation
       *
       * @param {string} path
       * @return {bool}
       */
      navigationDisabled (path) {
        if (path === 'connected' || path === 'sql') {
          return this.db === null ? '' : 'click'
        }

        return this.table === null ? '' : 'click'
      },

      /**
       * Connect to a database
       *
       * @param {object} conn
       * @param {int} i
       */
      connect (conn, i) {
        var $vm = this

        Connection.connect(conn, false)
        .then(ref => {
          this.connection = {
            i: i,
            ref: ref
          }

          // Redirect to /content
          $vm.$router.replace('connected')
        })
        .catch(err => $vm.$swal('Error', err, 'error'))
      }
    }
  }
</script>

<style lang="scss">
  html {
    overflow: hidden !important;
  }

  html,
  body,
  #app {
    height: 100%;
  }

  .is-overlay {
    z-index: 1;

    &.global {
      background: rgba(0, 0, 0, .5);
      z-index: 2;

      .hero {
        background: none;
      }

      h3 {
        color: #fff;
        margin-top: 20px;
      }
    }
  }

  nav > .container {
    max-width: 100%;
  }

  #top-bar > .column {
    background: #d4d4d4;
    padding-bottom: 0;

    .nav {
      background: #d4d4d4;
    }

    .select {
      margin-top: 7px;
    }

    .tabs a {
      display: block;
      padding: 0em 1em 0.3em 1em;
      font-size: 0.9rem;
      border-radius: 5px 5px 0 0;
      border: none;

      img {
        display: block;
        margin: auto;
        max-width: none;
        max-height: none;
      }
    }

    .tabs li.is-active a,
    .tabs a.is-active {
      background: #c3c3c3;
      border-radius: 5px 5px 0 0;
      color: #434343;
      z-index: 1;
    }

    .tabs li.disabled a,
    .tabs a[disabled] {
      opacity: 0.7;
      background: transparent !important;
      cursor: not-allowed;
    }
  }
</style>

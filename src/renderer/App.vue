<template>
  <div id="app">
    <div class="is-overlay global" v-if="loading">
      <div class="hero is-fullheight">
        <div class="hero-body">
          <div class="is-block-centered">
            <div class="loader is-block-centered"></div>
            <h3 class="is-block-centered">{{ loading_text }}</h3>
          </div>
        </div>
      </div>
    </div>

    <div class="columns" id="top-bar">
      <div class="column is-one-quarter padding-left">
        <div class="select">
          <select v-model="connection.i">
            <option value="0" disabled>Choose connection</option>
            <option v-for="(conn, i) in connections" :value="i">{{ conn.name }}</option>
          </select>
        </div>
      </div>
      <div class="column">
        <div class="tabs is-toggle">
          <ul>
              <router-link to="/table" class="nav-item is-tab">
                <img src="static/toolbar-switch-to-structure.png" alt="Switch to Structure">
                Structure
              </router-link>
            <li :class="{disabled: connection.db === null}">
              <router-link to="/table">
                <img src="static/toolbar-switch-to-browse.png" alt="Switch to Content">
                Content
              </router-link>
            </li>
            <li :class="{disabled: connection.db === null}">
              <router-link to="/table">
                <img src="static/toolbar-switch-to-table-relations.png" alt="Switch to Relations">
                Relations
              </router-link>
            </li>
            <li :class="{disabled: connection.db === null}">
              <router-link to="/table">
                <img src="static/toolbar-switch-to-sql.png" alt="Switch to SQL">
                Query
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <router-view ref="router"></router-view>
  </div>
</template>

<script>
  // import _ from 'lodash'
  // import * as moment from 'moment'
  // import Connection from './services/Connection'

  export default {
    name: 'sequel-bun',
    data () {
      return {
        loading: false,
        connection: {
          i: 0,
          db: null
        },
        connections: [] // Saved connections
      }
    }
  }
</script>

<style lang="scss">
  $fa-font-path: "~font-awesome/fonts";
  @import "~font-awesome/scss/font-awesome";

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
      border-radius: 0;
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
      background: lighten($blue, 5%);
      background-color: #3273dc;
      color: #fff;
      z-index: 1;
    }

    .tabs li.disabled a,
    .tabs a.disabled {
      opacity: 0.7;
      background: transparent !important;
      cursor: not-allowed;
    }
  }
</style>

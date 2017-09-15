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

    <!--<nav class="nav has-shadow">
      <div class="container">
        <div class="nav-left">
          <router-link to="/overview" class="nav-item is-tab">Overview</router-link>
          <router-link to="/urls" class="nav-item is-tab" :disabled="log_lines.length === 0">Requests</router-link>
          <a class="nav-item is-tab" href="#" @click.prevent="inputFile.click()" v-if="uploaded">
            <span class="icon margin-right-5">
              <i class="fa fa-upload"></i>
            </span>
            Upload new file
          </a>
        </div>
        <div class="nav-right nav-menu">
          <a class="nav-item is-tab" href="https://github.com/DaniloPolani/log-analyser" target="_blank">
            GitHub
          </a>
        </div>
      </div>
    </nav>-->

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
        connections: []
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
</style>

<template>
  <div class="section no-padding is-fullheight">

    <!-- Context menu -->
    <context-menu ref="ctxMenu" @ctx-open="onCtxOpen">
      <div class="dropdown is-active">
        <div class="dropdown-menu" role="menu">
          <div class="dropdown-content">
            <a href="#" class="dropdown-item">
              Truncate
            </a>
            <hr class="dropdown-divider">
            <a href="#" class="dropdown-item has-text-danger" @click="deleteConn()">
              Drop table
            </a>
          </div>
        </div>
      </div>
    </context-menu>

    <div class="columns is-fullheight">
      <aside class="column is-one-quarter menu padding-left">
        <p class="menu-label has-text-weight-bold">Tables</p>
        <!--<ul class="menu-list" v-if="$parent.connections.length > 0">
          <li v-for="(item, i) in $parent.connections" @contextmenu.prevent="$refs.ctxMenu.open($event, {i: i, item: item})">
            <a @click="connect(item, i)"><button class="button" :class="'is-' + item.color">{{ item.name }}</button></a>
          </li>
        </ul>
        <small class="has-text-grey" v-else>No table found.</small>-->
      </aside>

      <main class="column no-padding">
        <router-view ref="connected"></router-view>
      </main>
    </div><!-- /.columns -->
  </div><!-- /.section -->
</template>

<script>
  export default {
    name: 'connected',
    data: () => ({
      ctxData: {}
    }),

    created () {},

    methods: {
      /**
       * Handle context menu open
       *
       * @param {object} conn
       */
      onCtxOpen (conn) {
        this.ctxData = conn
      }
    }
  }
</script>

<style lang="scss">
</style>

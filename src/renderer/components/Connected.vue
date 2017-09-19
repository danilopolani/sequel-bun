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
        <!-- Show databases if not selected -->
        <div v-if="$parent.connection.ref.config.database === null">
          <p class="menu-label has-text-weight-bold">Databases</p>
          <ul class="menu-list" v-if="$parent.databases.length > 0">
            <li v-for="db in $parent.databases" @contextmenu.prevent="$refs.ctxMenu.open($event, {db: db})">
              <a @click="use(db)">{{ db }}</a>
            </li>
          </ul>
          <small class="has-text-grey" v-else>No database found.</small>
        </div>
        <div v-else>
          <p class="menu-label has-text-weight-bold">Tables</p>
          <ul class="menu-list" v-if="$parent.tables.length > 0">
            <li v-for="table in $parent.tables" @contextmenu.prevent="$refs.ctxMenu.open($event, {tabls: table})">
              <a @click="show(table)">{{ table }}</a>
            </li>
          </ul>
          <small class="has-text-grey" v-else>No table found.</small>
        </div>
      </aside>

      <main class="column no-padding">
        <router-view ref="connected"></router-view>
      </main>
    </div><!-- /.columns -->
  </div><!-- /.section -->
</template>

<script>
  // import _ from 'lodash'

  export default {
    name: 'connected',
    data: () => ({
      ctxData: {}
    }),

    /**
     * Retrieve databases and tables (if db provided)
     */
    created () {
      let $vm = this

      // Retrieve databases
      $vm.$parent.connection.ref.query('SHOW DATABASES')
      .then(res => {
        $vm.$parent.databases = res.map(row => row.Database)
      })
      .catch(err => {
        $vm.$swal('Error', 'Error retrieving databases: ' + err.message, 'error')
      })

      // Retrieve tables, if database selected
      if ($vm.$parent.connection.config.database !== null) {
        $vm.$parent.connection.ref.query('SHOW TABLES')
        .then(res => {
          $vm.$parent.tables = res.map(row => row.Table)
        })
        .catch(err => {
          $vm.$swal('Error', 'Error retrieving tables: ' + err.message, 'error')
        })
      }
    },

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

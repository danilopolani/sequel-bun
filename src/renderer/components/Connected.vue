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
        <div v-if="$parent.db === null">
          <p class="menu-label has-text-weight-bold">Databases</p>
          <ul class="menu-list" v-if="$parent.databases.length > 0">
            <li v-for="db in $parent.databases" @contextmenu.prevent="$refs.ctxMenu.open($event, {db: db})">
              <a @click="use(db)">
                <img src="static/database-small.png" :alt="'Database ' + db" />
                {{ db }}
              </a>
            </li>
          </ul>
          <small class="has-text-grey" v-else>No database found.</small>
        </div>
        <div v-else>
          <p class="menu-label has-text-weight-bold">Tables</p>
          <ul class="menu-list" v-if="$parent.tables.length > 0">
            <li v-for="table in $parent.tables" @contextmenu.prevent="$refs.ctxMenu.open($event, {tabls: table})">
              <a @click="show(table)">
                <img src="static/table-small.png" :alt="'Table ' + table" />
                {{ table }}
              </a>
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
      ctxData: {},
      conn: null
    }),

    /**
     * Retrieve databases and tables (if db provided)
     */
    created () {
      let $vm = this

      // Assign conn
      $vm.conn = $vm.$parent.connection.ref

      // Retrieve databases
      $vm.conn.query('SHOW DATABASES')
      .then(res => {
        $vm.$parent.databases = res.map(row => row.Database)
      })
      .catch(err => {
        $vm.$swal('Error', 'Error retrieving databases: ' + err.message, 'error')
      })

      // Retrieve tables, if database selected
      if ($vm.conn.config.database !== null) {
        $vm.tables()
      }
    },

    methods: {
      /**
       * Change database
       *
       * @param {string} db
       */
      use (db) {
        let $vm = this

        $vm.conn.changeUser({database: db}, () => {
          $vm.$parent.db = db
          $vm.tables()
        })
      },

      /**
       * Retrieve database tables
       */
      tables () {
        let $vm = this

        $vm.$parent.connection.ref.query('SHOW TABLES')
        .then(res => {
          $vm.$parent.tables = res.map(row => row['Tables_in_' + $vm.$parent.db])
        })
        .catch(err => {
          $vm.$swal('Error', 'Error retrieving tables: ' + err.message, 'error')
        })
      },

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
aside.menu ul.menu-list li a {
  img {
    position: relative;
    top: 2px;
    margin-right: 5px;
  }

  &:hover {
    color: #fff;
  }
}
</style>

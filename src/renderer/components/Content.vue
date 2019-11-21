<template>
  <div class="is-fullheight">
    <!-- Search -->
    <div id="content-search-bar">
      <div class="columns">
        <div class="column has-text-right">
          Search:
        </div>
        <div class="column is-2"><!-- Field -->
          <div class="select is-fullwidth">
            <select v-model="search.column">
              <option v-for="column in $parent.columns" :key="column.name">
                {{ column.name }}
              </option>
            </select>
          </div>
        </div>
        <div class="column is-2"><!-- Operator -->
          <div class="select is-fullwidth">
            <select v-model="search.operator">
              <option value="=">=</option>
              <option value="<>">&ne;</option>
              <option value=">">&gt;</option>
              <option value="<">&lt;</option>
              <option value=">=">&ge;</option>
              <option value="<=">&le;</option>
              <option value="IN">IN</option>
              <option value="LIKE">LIKE</option>
              <option value="BETWEEN">BETWEEN</option>
              <option value="IS NULL">IS NULL</option>
              <option value="IS NOT NULL">IS NOT NULL</option>
            </select>
          </div>
        </div>
        <div class="column is-6"><!-- Input -->
          <input type="text" class="input is-fullwidth has-text-center" placeholder="Search"
            v-model="search.text"
            :disabled="search.operator.indexOf('NULL') > -1"
            @keyup.enter="search.text.trim().length === 0 ? '' : doSearch()">
        </div>
        <div class="column" v-if="search.searched">
          <button class="button is-danger is-rounded has-text-centered"
            @click="resetSearch()">
            <span class="icon">
              <i class="fa fa-times"></i>
            </span>
          </button>
        </div>
        <div class="column is-1">
          <button class="button is-info is-rounded is-fullwidth"
            :disabled="querying || (search.text.trim().length === 0 && search.operator.indexOf('NULL') === -1)"
            @click="doSearch()">
            Filter
          </button>
        </div>
      </div>
    </div>

    <!-- Table content -->
    <div class="main-table full">
      <!-- Table -->
      <VuePerfectScrollbar class="scrollable with-action-bar">
        <table class="table is-striped is-narrow is-fullwidth">
          <thead>
            <tr>
              <th v-for="(column, i) in $parent.columns"
                :class="[columnClass(column.name), {'no-border-left': i == 0, 'no-border-right': i == columns.length - 1}]" :key="i">
                <span>{{ column.name }}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, ri) in rows"
              :class="{'is-active': currentRow == ri}"
              @click="activeRow(ri, $event)"
              :key="ri">
              <td v-for="(column, ci) in $parent.columns"
                :class="['has-input', columnClass(column.name), {
                  'no-border-left': ci === 0,
                  'no-border-right': ci == columns.length - 1,
                  'is-null': row[column.name] === null && !editInput,
                  'has-icon': (foreignKey(column.name) && row[column.name]) || isURL(row[column.name])
                }]"
                :key="ci">

                <!-- All data except enum / set -->
                <input type="text" class="masked"
                  v-model="row[column.name]"
                  v-if="column.type != 'ENUM' && column.type != 'SET'"
                  :readonly="!editInput"
                  @dblclick="editInput = true"
                  @blur="editInput = false"
                  @focus="oldValue = row[column.name]"
                  @change="$parent.primary_key !== null ? save(row[$parent.primary_key], column.name, row[column.name]) : ''"
                  @keyup.enter="$event.target.blur()"
                  @keyup.esc="restore(ri, column.name, $event)">

                <!-- Enum / Set -->
                <div class="select" v-if="column.type === 'ENUM' || column.type === 'SET'">
                  <select class="masked"
                    v-model="row[column.name]"
                    :readonly="!editInput"
                    @dblclick="editInput = true"
                    @blur="editInput = false"
                    @focus="oldValue = row[column.name]"
                    @change="$parent.primary_key !== null ? save(row[$parent.primary_key], column.name, row[column.name]) : ''"
                    @keyup.enter="$event.target.blur()"
                    @keyup.esc="restore(ri, column.name, $event)">
                    <option v-for="(opt, oi) in enumSet(column.len)" :key="oi">
                      {{ opt }}
                    </option>
                  </select>
                </div>

                <!-- Foreign key -->
                <i class="fa fa-arrow-circle-right" v-if="foreignKey(column.name) && row[column.name]" @click="toForeign(column.name, row[column.name])"></i>
                <!-- URL -->
                <i class="fa fa-external-link" v-if="isURL(row[column.name]) && !foreignKey(column.name)" @click="openURL(row[column.name])"></i>
              </td>
            </tr>

            <!-- New row -->
            <!-- <tr>
              <td class="has-input">
                <input type="text" v-model="newColumn" class="masked" placeholder="New column name" />
              </td>
            </tr> -->
          </tbody>
        </table>
      </VuePerfectScrollbar><!-- /scrollable -->

      <!-- Action bar -->
      <div class="action-bar field has-addons space-between">
        <!-- Left buttons -->
        <div>
          <a class="button">
            <span class="icon is-small">
              <i class="fa fa-plus"></i>
            </span>
          </a>
          <a class="button">
            <span class="icon is-small">
              <i class="fa fa-minus"></i>
            </span>
          </a>
          <a class="button">
            <span class="icon is-small">
              <i class="fa fa-refresh"></i>
            </span>
          </a>
        </div>

        <!-- Right buttons -->
        <div>
          <a class="button border-left" :disabled="page === 1">
            <span class="icon is-small">
              <i class="fa fa-caret-left"></i>
            </span>
          </a>
          <a class="button">
            <span class="icon is-small">
              <i class="fa fa-cog"></i>
            </span>
          </a>
          <a class="button no-border-right" :disabled="page === pages">
            <span class="icon is-small">
              <i class="fa fa-caret-right"></i>
            </span>
          </a>
        </div>
      </div><!-- /action bar -->
    </div><!-- /main table -->
  </div>
</template>

<script>
  import _ from 'lodash'
  import VuePerfectScrollbar from 'vue-perfect-scrollbar'
  import { shell } from 'electron'

  export default {
    name: 'structure',
    components: {
      VuePerfectScrollbar
    },
    data: () => ({
      columns: {}, // Table columns
      newColumn: null,
      currentRow: null,
      querying: false, // Is running query
      editInput: false,
      oldValue: null, // Old value when editing input
      updateCanceled: false, // When pressing "ESC" to cancel updates, this will be true to disable query
      conn: null, // Connection instance
      table: null, // Current table
      rows: [], // Query result
      orderBy: {},
      // Search bar
      search: {
        searched: false,
        column: null,
        operator: '=',
        text: ''
      },
      // Pagination
      page: 1,
      limit: 50,
      count: 0,
      // Context menu
      ctxData: {}
    }),

    computed: {
      /**
       * Return total pages count.
       *
       * @return {number}
       */
      pages () {
        if (this.count === 0) {
          return 0
        }

        return Math.ceil(this.count / this.limit)
      }
    },

    created () {
      let $vm = this
      $vm.columns = $vm.$parent.tables_columns[$vm.$parent.table]
      $vm.search.column = $vm.columns[0].name
      $vm.conn = $vm.$parent.$parent.connection.ref
      $vm.table = $vm.$parent.table

      // Build query
      let query = 'SELECT * FROM `' + $vm.table + '`'
      if ($vm.$parent.primary_key !== null) {
        query += ' ORDER BY `' + $vm.$parent.primary_key + '` DESC'
        $vm.orderBy[$vm.$parent.primary_key] = 'DESC'
      }
      query += ' LIMIT ' + $vm.limit

      $vm.conn.query(query)
      .then(res => {
        $vm.rows = res

        const whatCount = $vm.$parent.primary_key !== null ? $vm.$parent.primary_key : '*'
        const countQuery = 'SELECT COUNT(`' + whatCount + '`) AS cnt FROM `' + $vm.table + '`'
        // Count rows
        $vm.conn.query(countQuery)
        .then(res => $vm.count = res[0].cnt)
        .catch(err => {
          $vm.$swal('Error', 'Unable to retrieve total records count with query <code>' + query + '</code>: <small>' + err.message + '</small>', 'error')
        })
      })
      .catch(err => {
        $vm.$swal('Error', 'Error retrieving data from query <code>' + query + '</code>: <small>' + err.message + '</small>', 'error')
      })
    },

    methods: {
      /**
       * Set active row
       *
       * @param {int} i
       * @param {object} e
       */
      activeRow (i, e) {
        if (this.$parent.primary_key !== null && e.target.className.indexOf('fa-') === -1) {
          this.currentRow = i
        }
      },

      /** Restore the previous value
       *
       * @param {int} row - The row index
       * @param {string} col - The column name
       * @param {string} e - Event
       */
      restore (row, col, e) {
        this.$set(this.rows[row], col, this.oldValue)
        this.updateCanceled = true
        e.target.blur()
      },

      /** Update a record
       *
       * @param {string} key - The primary key value
       * @param {string} col - The column name
       * @param {string} val - The new value
       */
      save (key, col, val) {
        let $vm = this
        if ($vm.updateCanceled) {
          $vm.updateCanceled = false
          return
        }

        const query = `UPDATE \`${$vm.table}\` SET \`${col}\` = '${val}' WHERE \`${$vm.$parent.primary_key}\` = '${key}'`
        $vm.conn.query(query)
        .catch(err => $vm.$swal('Error', 'Error executing query <code>' + query + '</code>: <small>' + err.message + '</small>', 'error'))
      },

      /**
       * Execute a search
       */
      doSearch () {
        let $vm = this
        const query = $vm._buildQuery()

        $vm.conn.query(query)
        .then(rows => {
          $vm.rows = rows
          $vm.search.searched = true
        })
        .catch(err => $vm.$swal('Error', 'Error executing query <code>' + query + '</code>: <small>' + err.message + '</small>', 'error'))
      },

      /**
       * Reset search filters.
       */
      resetSearch () {
        this.search.text = ''
        this.search.searched = false
      },

      /**
       * Go to another table through a foreign key
       *
       * @param {string} key
       * @param {string} val
       */
      async toForeign (key, val) {
        let $vm = this

        const { table, col } = $vm.$parent.foreign_keys[key]
        // Retrieve structure
        await $vm.$parent.structure(table, false)

        const q = `SELECT * FROM \`${table}\` WHERE \`${col}\` = '${val}'`
        $vm.conn.query(q)
        .then(res => {
          $vm.rows = res
          // Reset current row
          $vm.currentRow = null
        })
        .catch(err => $vm.$swal('Error', 'Error executing query <code>' + q + '</code>: <small>' + err.message + '</small>', 'error'))
      },

      /** Change page
       */
      changePage (page) {

      },

      /**
       * Retrieve enum / set value as array
       *
       * @param {string} val
       * @return {array}
      */
      enumSet (val) {
        return val.replace(/'/g, '').replace(/"/g, '').split(',')
      },

      /**
       * Return the foreign key of a column or false
       *
       * @param {string} col
       * @return {any}
       */
      foreignKey (col) {
        if (this.$parent.foreign_keys.hasOwnProperty(col)) {
          return this.$parent.foreign_keys[col]
        }

        return false
      },

      /**
       * Check if a string is a URL
       *
       * @param {string} str
       * @return {bool}
       */
      isURL (str) {
        const regex = /^(?:(?:https?):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/i
        return regex.test(str)
      },

      /**
       * Open URL in the browser
       *
       * @param {string} str
       */
      openURL (url) {
        shell.openExternal(url)
      },

      /**
       * Get a specific class based on column name
       *
       * @param {string} col
       * @return {string}
       */
      columnClass (col) {
        return _.endsWith(col, '_id') || col.toLowerCase() === 'id' ? 'width-80' : ''
      },

      /**
       * Build the query
       *
       * @private
       * @return {String}
       */
      _buildQuery () {
        let $vm = this

        let query = 'SELECT * FROM `' + $vm.table + '` '
        if ($vm.search.searched) {
          query += ' WHERE `' + $vm.search.column + '` '
          if ($vm.search.operator.indexOf('NULL') > -1) {
            query += $vm.search.operator
          } else if ($vm.search.operator === 'BETWEEN') {
            // To do
          } else {
            query += $vm.search.operator + ` '${$vm.search.text}'`
          }
        }

        if ($vm.$parent.primary_key !== null) {
          query += ' ORDER BY `' + $vm.$parent.primary_key + '` DESC '
        }

        const from = ($vm.page - 1) * $vm.limit
        query += ` LIMIT ${from}, ${$vm.limit}`

        return query
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
table {
  overflow-x: auto;
}

#content-search-bar {
  background: #ececec;
  border-bottom: 1px solid #d6d6d6;
  padding: 7px 15px 5px 15px;

  .columns {
    margin: 0;

    .column {
      padding-top: 0;
      padding-bottom: 0;
      padding-left: 0;

      &:first-child {
        line-height: 32px;
      }

      &:last-child {
        padding-right: 0;
      }
    }
  }
}

.is-null {
  position: relative;

    &::after {
    content: 'NULL';
    position: absolute;
    left: 50%;
    top: 5px;
    background: rgba(0, 0, 0, .4);
    width: auto;
    height: auto;
    color: #fff;
    text-align: center;
    font-size: 10px;
    margin: auto;
    margin-left: -20px;
    padding: 1px 5px;
  }
}
</style>

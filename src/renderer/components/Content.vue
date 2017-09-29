<template>
  <div class="is-fullheight">
    <!-- Search -->
    <div id="content-search-bar">
      <div class="columns">
        <div class="column is-1 has-text-right">
          Search:
        </div>
        <div class="column is-2"><!-- Field -->
          <div class="select is-fullwidth">
            <select v-model="search.column">
              <option v-for="column in columns" :key="column.name">
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
        <div class="column is-1">
          <button class="button is-info action osx active is-fullwidth"
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
              <th v-for="(column, i) in columns"
                :class="[columnClass(column.name), {'no-border-left': i == 0, 'no-border-right': i == columns.length - 1}]" :key="i">
                {{ column.name }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, ri) in rows"
              :class="{'is-active': currentRow == ri}"
              @click="$parent.primary_key !== null ? currentRow = ri : ''"
              :key="ri">
              <td v-for="(column, ci) in columns"
                :class="['has-input', columnClass(column.name), {'no-border-left': ci === 0, 'no-border-right': ci == columns.length - 1, 'is-null': row[column.name] === null && !editInput}]"
                :key="ci">
                <input type="text" class="masked"
                  v-model="row[column.name]"
                  :readonly="!editInput"
                  @dblclick="editInput = true"
                  @blur="editInput = false"
                  @focus="oldValue = row[column.name]"
                  @change="$parent.primary_key !== null ? save(row[$parent.primary_key], column.name, row[column.name]) : ''"
                  @keyup.enter="$event.target.blur()"
                  @keyup.esc="restore(ri, column.name, $event)">
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
      <div class="action-bar field has-addons">
        <a class="button">
          <span class="icon is-small">
            <i class="fa fa-plus"></i>
          </span>
        </a>
        <a class="button" :disabled="currentRow === null">
          <span class="icon is-small">
            <i class="fa fa-minus"></i>
          </span>
        </a>
        <a class="button">
          <span class="icon is-small">
            <i class="fa fa-refresh"></i>
          </span>
        </a>
      </div><!-- /action bar -->
    </div><!-- /main table -->
  </div>
</template>

<script>
  import _ from 'lodash'
  import VuePerfectScrollbar from 'vue-perfect-scrollbar'

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
        column: null,
        operator: '=',
        text: ''
      },
      // Pagination
      limit: 500,
      page: 1,
      // Context menu
      ctxData: {}
    }),

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
      .then(res => $vm.rows = res)
      .catch(err => {
        $vm.$swal('Error', 'Error retrieving data from query <code>' + query + '</code>: <small>' + err.message + '</small>', 'error')
      })
    },

    methods: {
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

        // Build query
        let query = `SELECT * FROM \`${$vm.table}\` WHERE \`${$vm.search.column}\` `
        if ($vm.search.operator.indexOf('NULL') > -1) {
          query += $vm.search.operator
        } else if ($vm.search.operator === 'BETWEEN') {
          // To do
        } else {
          query += $vm.search.operator + ` '${$vm.search.text}'`
        }
        if ($vm.$parent.primary_key !== null) {
          query += ` ORDER BY \`${$vm.$parent.primary_key}\` DESC`
        }
        query += ' LIMIT ' + $vm.limit

        $vm.conn.query(query)
        .then(rows => $vm.rows = rows)
        .catch(err => $vm.$swal('Error', 'Error executing query <code>' + query + '</code>: <small>' + err.message + '</small>', 'error'))
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

<template>
  <div class="is-fullheight">
    <!-- Table content -->
    <div class="main-table">
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
                :class="['has-input', columnClass(column.name), {'no-border-left': ci === 0, 'no-border-right': ci == columns.length - 1}]"
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
    <div class="secondary-table">
      <div class="scrollable with-action-bar">
        Foo
      </div><!-- /scrollable -->
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
      editInput: false,
      oldValue: null, // Old value when editing input
      updateCanceled: false, // When pressing "ESC" to cancel updates, this will be true to disable query
      conn: null, // Connection instance
      table: null, // Current table
      rows: [], // Query result
      orderBy: {},
      // Pagination
      limit: 1000,
      page: 1,
      // Context menu
      ctxData: {}
    }),

    created () {
      let $vm = this
      $vm.columns = $vm.$parent.tables_columns[$vm.$parent.table]
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
        .catch(err => {
          $vm.$swal('Error', 'Error executing query <code>' + query + '</code>: <small>' + err.message + '</small>', 'error')
        })
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
</style>

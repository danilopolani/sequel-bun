<template>
  <div class="is-fullheight">
    <!-- Table content -->
    <div class="main-table">
      <VuePerfectScrollbar class="scrollable with-action-bar">
        <table class="table is-striped is-narrow is-fullwidth">
          <thead>
            <tr>
              <th v-for="(column, i) in columns" :class="{'no-border-left': i == 0, 'no-border-right': i == columns.length - 1}">
                {{ column.name }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, ri) in rows" :class="{'is-active': currentRow == ri}" @click="currentRow = ri">
              <td v-for="(column, ci) in columns" :class="['has-input', {'no-border-left': ci === 0}]">
                <input type="text" class="masked" :value="row[column.name]" :readonly="!editInput" @dblclick="editInput = true" @blur="editInput = false">
              </td>
            </tr>

            <!-- New row -->
            <tr>
              <td class="has-input">
                <input type="text" v-model="newColumn" class="masked" placeholder="New column name" />
              </td>
              <td>
                <div class="select is-invisible"><!-- Just to create the correct height -->
                  <select></select>
                </div>
              </td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
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
        $vm.$swal('Error', 'Error retrieving data from query <em><small>' + query + '</small></em>: ' + err.message, 'error')
      })
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
table {
  overflow-x: auto;
}
</style>

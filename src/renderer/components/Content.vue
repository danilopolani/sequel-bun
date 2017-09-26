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
            <!--<tr v-for="field in $parent.fields" :class="{'is-active': currentField == field.name}" @click="currentField = field.name">
              <td class="no-border-left has-input">
                <input type="text" v-model="field.name" class="masked" :readonly="!editInput" @dblclick="editInput = true" @blur="editInput = false">
              </td>
            </tr>-->

            <!-- New column -->
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
        <a class="button" :disabled="currentField === null">
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
      columns: {},
      newColumn: null,
      currentColumn: null,
      editInput: false,
      ctxData: {}
    }),

    created () {
      let $vm = this
      $vm.columns = $vm.$parent.$parent.tables_fields[$vm.$parent.table]
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

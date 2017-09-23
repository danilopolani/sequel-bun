<template>
  <div class="is-fullheight">
    <!-- Table structure -->
    <div class="main-table">
      <div class="scrollable with-action-bar">
        <table class="table is-striped is-narrow is-fullwidth">
          <thead>
            <tr>
              <th class="no-border-left">Field</th>
              <th>Type</th>
              <th>Length</th>
              <th>Unsigned</th>
              <th>Allow Null</th>
              <th>Key</th>
              <th>Default</th>
              <th class="no-border-right">Extra</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="field in $parent.fields">
              <td class="no-border-left">{{ field.name }}</td>
              <td>
                <div class="select">
                  <select v-model="field.type">
                    <!-- Common types -->
                    <option v-for="commonType in $parent.common_column_types" :value="commonType.name">
                      {{ commonType.name }}
                    </option>
                    <!-- All grouped -->
                    <optgroup v-for="typeGroup in $parent.column_types" :label="typeGroup.name">
                      <option v-for="typeGroupType in typeGroup.children" :value="typeGroupType.name" :disabled="typeGroupType.name == '-'">
                        {{ typeGroupType.name }}
                      </option>
                    </optgroup>
                  </select>
                </div>
              </td>
              <td>
                <input type="text" v-model="field.len" class="masked">
              </td>
              <td class="has-text-centered">
                <input type="checkbox" :checked="field.unsigned">
              </td>
              <td class="has-text-centered">
                <input type="checkbox" :checked="field.null">
              </t>
              <td>
                <div class="select">
                  <select v-model="field.key">
                    <option value="PRI">Primary</option>
                    <option value="UNI">Unique</option>
                    <option value="MUL">Index</option>
                  </select>
                </div>
              </td>
              <td>
                <input type="text" v-model="field.default" class="masked">
              </td>
              <td class="no-border-right">{{ field.extra }}</td>
            </tr>
          </tbody>
        </table>
      </div><!-- /scrollable -->

      <!-- Action bar -->
      <div class="action-bar field has-addons">
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
  export default {
    name: 'structure',
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
table {
  overflow-x: auto;
}
</style>

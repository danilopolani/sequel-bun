<template>
  <table class="table is-bordered is-striped is-narrow is-fullwidth">
    <thead>
      <tr>
        <th class="no-border-left">Field</th>
        <th class="no-border-left">Type</th>
        <th class="no-border-left">Length</th>
        <th class="no-border-left">Unsigned</th>
        <th class="no-border-left">Allow Null</th>
        <th class="no-border-left">Key</th>
        <th class="no-border-left">Default</th>
        <th class="no-border-left">Extra</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="field in $parent.fields">
        <td class="no-border-left">{{ field.name }}</td>
        <td class="no-border-left">
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
        <td class="no-border-left">{{ field.len }}</td>
        <td class="no-border-left">
          <input type="checkbox" :checked="field.unsigned">
        </td>
        <td class="no-border-left">
          <input type="checkbox" :checked="field.null">
        </td>
        <td class="no-border-left">{{ field.key }}</td>
        <td class="no-border-left">{{ field.default }}</td>
        <td class="no-border-left">{{ field.extra }}</td>
      </tr>
    </tbody>
  </table>
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

<template>
  <table class="table is-bordered is-striped is-narrow is-fullwidth">
    <thead>
      <tr>
        <th class="no-border-left">Field</th>
        <th class="no-border-left">Type</th>
        <th class="no-border-left">Length</th>
        <th class="no-border-left">Unsigned</th>
        <th class="no-border-left">Null</th>
        <th class="no-border-left">Key</th>
        <th class="no-border-left">Default</th>
        <th class="no-border-left">Extra</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="field in $parent.fields">
        <td class="no-border-left">{{ field.Field }}</td>
        <td class="no-border-left">{{ field.Type }}</td>
        <td class="no-border-left">{{ field.Type }}</td>
        <td class="no-border-left">{{ field.Type }}</td>
        <td class="no-border-left">{{ field.Null }}</td>
        <td class="no-border-left">{{ field.Key }}</td>
        <td class="no-border-left">{{ field.Default }}</td>
        <td class="no-border-left">{{ field.Extra }}</td>
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

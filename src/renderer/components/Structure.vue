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
        <th class="no-border-left">Comment</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="no-border-left">id</td>
        <td class="no-border-left">INT</td>
        <td class="no-border-left">11</td>
        <td class="no-border-left">[x]</td>
        <td class="no-border-left">[ ]</td>
        <td class="no-border-left">PRIMARY</td>
        <td class="no-border-left"></td>
        <td class="no-border-left">auto_increment</td>
        <td class="no-border-left"></td>
      </tr>
      <tr>
        <td class="no-border-left">user_id</td>
        <td class="no-border-left">VARCHAR</td>
        <td class="no-border-left">255</td>
        <td class="no-border-left">[ ]</td>
        <td class="no-border-left">[x]</td>
        <td class="no-border-left"></td>
        <td class="no-border-left">NULL</td>
        <td class="no-border-left">None</td>
        <td class="no-border-left"></td>
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
</style>

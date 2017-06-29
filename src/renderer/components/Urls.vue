<template>
  <section class="margin-top-30">

    <div class="padding-left-right-15">
      <div class="is-pulled-left">
        <h1 class="title is-spaced margin-bottom-5">
          Access requests
        </h1>
        <h2 class="subtitle margin-bottom-30">
          See all access requests details
        </h2>
      </div>
      <div class="is-pulled-right">
        <p class="control">
          <span class="select">
            <select v-model="type">
              <option value="" disabled>View type</option>
              <option value="collapsed" selected>Collapsed (unique data)</option>
              <option value="expanded" selected>Expanded (line by line)</option>
            </select>
          </span>
        </p>
      </div>
      <div class="is-clearfix"></div>
    </div>

    <div class="table-data-collapsed">
      <datatable
        v-if="type == 'collapsed'"
        :columns="collapsed_columns"
        :rows="$parent.log_lines_stats"
        :perPage="[100, 10, 25, 50, 500]"></datatable>

      <datatable
        v-if="type == 'expanded'"
        :columns="expanded_columns"
        :rows="$parent.log_lines"
        :perPage="[100, 10, 25, 50, 500]"></datatable>
    </div>
  </section>
</template>

<script>
  import DataTable from 'vue-materialize-datatable'

  export default {
    name: 'urls',
    components: {
      datatable: DataTable
    },
    data () {
      return {
        type: 'collapsed',
        collapsed_columns: [
          {
            label: 'Method',
            field: 'method',
            html: true,
            width: '100px'
          },
          {
            label: 'URL',
            field: 'url',
            width: '30%'
          },
          {
            label: 'Last status code',
            field: 'last_status',
            html: true,
            width: '160px'
          },
          {
            label: 'Last call at',
            field: 'date',
            width: '160px'
          },
          {
            label: 'Last agent',
            field: 'last_agent',
            width: '20%'
          }
        ],
        expanded_columns: [
          {
            label: 'Method',
            field: 'method',
            html: true,
            width: '100px'
          },
          {
            label: 'URL',
            field: 'url',
            width: '30%'
          },
          {
            label: 'HTTP Status Code',
            field: 'status',
            html: true,
            width: '160px'
          },
          {
            label: 'Date',
            field: 'date',
            width: '160px'
          },
          {
            label: 'Agent',
            field: 'agent',
            width: '20%'
          }
        ]
      }
    }
  }
</script>

<style lang="scss">
$material-design-icons-font-path: "~material-design-icons-iconfont/dist/fonts/";
@import "~material-design-icons-iconfont/dist/material-design-icons";

.table-data-collapsed .card {
  .table-header {
    height: 50px !important;
    .actions {
      position: relative;
      top: 2px;
    }
  }

  table {
    border-collapse: #eee;
    th {
      padding-left: 15px !important;
      padding-right: 15px !important;

      // Method
      &:first-child {
        text-align: center;
      }

      // Status code
      &:nth-child(3) {
        text-align: center;
      }
    }

    tr td {
      height: auto;
      padding: 10px 15px !important;

      // Method
      &:first-child {
        text-align: center;
      }

      // URL
      &:nth-child(2) > div {
        word-break: break-all;
        white-space: normal;
      }

      // Status code
      &:nth-child(3) {
        text-align: center;
      }

      // Agent
      &:last-child > div {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }
  }

  .table-footer {
    border-top: 1px solid #eee;

    .material-pagination li a {
      outline: none;
    }
  }
}
</style>

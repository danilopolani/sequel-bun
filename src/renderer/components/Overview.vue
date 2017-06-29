<template>
  <main id="overview-section">
    <!-- Always present -->
    <input type="file" class="is-hidden" ref="file" @change="onFileChange($event)">

    <section v-if="!$parent.uploaded || $parent.loading">
      <!-- If there isn't an uploaded file -->
      <!-- Create an overlay where drop files -->
      <div class="is-overlay dropzone"
        @dragover.prevent
        @dragenter="hovering = true"
        @dragleave="hovering = false"
        @drop="drop"
        @click="$refs.file.click()"
        :class="{'overlay-dropping': hovering}"></div>

      <div class="container">
        <h1 class="title has-text-centered padding-top-50 is-spaced">
          Log Analyser
        </h1>
        <h2 class="subtitle has-text-centered">
          Drag here a file or click anywhere to choose it
        </h2>
      </div>

      <input type="file" class="is-hidden" ref="file" @change="onFileChange($event)">
    </section>

    <!-- Show dashboard for uploaded file -->
    <section class="margin-top-15 is-fullheight" v-else>
      <div class="half-horizontal">
        <div class="half-vertical">
          <table class="table table-striped">
            <tbody>
              <tr>
                <td><strong>Unique URLs</strong></td>
                <td>{{ $parent.uniqueUrls.toLocaleString() }}</td>
              </tr>
              <tr>
                <td><strong>Average request size</strong></td>
                <td>{{ humanBytes($parent.avgSize) }}</td>
              </tr>
              <tr>
                <td><strong>Errors</strong></td>
                <td>{{ $parent.errors }}</td>
              </tr>
              <tr v-for="(code_count, code_type) in $parent.codes_count">
                <td><strong>{{ codes_labels[code_type] }}</strong></td>
                <td>{{ code_count.toLocaleString() }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="half-vertical">
          <!-- Chart -->
          <bar-chart :data="codes_chart"></bar-chart>
        </div>
      </div><!-- /.half-horizontal -->
      <div class="half-horizontal">
        <div class="half-vertical">
          <!-- Legend -->
          <div class="content is-small margin-bottom-5">
            <div class="columns">
              <div class="column has-text-centered" v-for="(hex, name) in codes_hex">
                <span class="legend-dot" :style="{ borderColor: hex }"></span>
                {{ codes_labels[name] }}
              </div>
            </div>
          </div>

          <!-- Chart -->
          <line-chart :data="errors_chart"></line-chart>
        </div>
        <div class="half-vertical">
          <!-- Chart -->
          <line-chart :data="errors_chart"></line-chart>
        </div>
      </div><!-- /.half-vertical -->

      <div class="is-clearfix"></div>
    </section>
  </main>
</template>

<script>
  import _ from 'lodash'

  export default {
    name: 'overview',
    data () {
      return {
        hovering: false,
        codes_labels: {
          '2xx': 'Success (2xx)',
          '3xx': 'Redirection (3xx)',
          '4xx': 'Client Error (4xx)',
          '5xx': 'Server Error (5xx)'
        },
        codes_hex: {
          '2xx': '#23D260',
          '3xx': '#3273DD',
          '4xx': '#FF470F',
          '5xx': '#FF3860'
        }
      }
    },
    computed: {
      errors_chart () {
        return {
          labels: Object.keys(this.$parent.codes_in_time),
          datasets: [
            {
              label: this.codes_labels['2xx'],
              borderColor: this.codes_hex['2xx'],
              data: _.map(this.$parent.codes_in_time, '2xx')
            },
            {
              label: this.codes_labels['3xx'],
              borderColor: this.codes_hex['3xx'],
              data: _.map(this.$parent.codes_in_time, '3xx')
            },
            {
              label: this.codes_labels['4xx'],
              borderColor: this.codes_hex['4xx'],
              data: _.map(this.$parent.codes_in_time, '4xx')
            },
            {
              label: this.codes_labels['5xx'],
              borderColor: this.codes_hex['5xx'],
              data: _.map(this.$parent.codes_in_time, '5xx')
            }
          ]
        }
      },
      codes_chart () {
        return {
          labels: Object.values(this.codes_labels),
          datasets: [
            {
              label: 'Errors',
              backgroundColor: [this.codes_hex['2xx'], this.codes_hex['3xx'], this.codes_hex['4xx'], this.codes_hex['5xx']],
              data: [this.$parent.codes_count['2xx'], this.$parent.codes_count['3xx'], this.$parent.codes_count['4xx'], this.$parent.codes_count['5xx']]
            }
          ]
        }
      }
    },
    methods: {
      /**
       * Drop file to analyse it
       *
       * @param event e
      */
      drop (e) {
        e.preventDefault()
        const files = e.target.files || e.dataTransfer.files
        this.hovering = false

        // Read file
        this.$parent.readFile(files[0].path)
      },
      /**
       * File changed in input
       *
       * @param event e
       */
      onFileChange (e) {
        const files = e.target.files || e.dataTransfer.files

        // Read file
        this.$parent.readFile(files[0].path)
      },
      humanBytes (bytes) {
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
        if (bytes === 0) return 'n/a'
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10)
        if (i === 0) return `${bytes} ${sizes[i]})`
        return `${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`
      }
    }
  }
</script>

<style lang="scss">
.is-overlay.dropzone {
  background: transparent;
  top: 53px;
  cursor: pointer;
}
.is-overlay.dropzone.overlay-dropping {
  background: rgba(252, 252, 252, 0.8);
}
.loader {
  width: 3em;
  height: 3em;
  border-width: 3px;
}

#overview-section {
  height: calc(100% - 15px - 3.25rem);
}

.legend-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  display: inline-block;
  border: 3px solid #fff;
  margin-right: 3px;
  position: relative;
  top: 2px;
}
</style>

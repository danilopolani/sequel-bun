<template>
  <div id="app">
    <div class="is-overlay global" v-if="loading">
      <div class="hero is-fullheight">
        <div class="hero-body">
          <div class="is-block-centered">
            <div class="loader is-block-centered"></div>
            <h3 class="is-block-centered">{{ loading_text }}</h3>
          </div>
        </div>
      </div>
    </div>

    <nav class="nav has-shadow">
      <div class="container">
        <div class="nav-left">
          <router-link to="/overview" class="nav-item is-tab">Overview</router-link>
          <router-link to="/urls" class="nav-item is-tab" :disabled="log_lines.length === 0">Requests</router-link>
          <a class="nav-item is-tab" href="#" @click.prevent="inputFile.click()" v-if="uploaded">
            <span class="icon margin-right-5">
              <i class="fa fa-upload"></i>
            </span>
            Upload new file
          </a>
        </div>
        <div class="nav-right nav-menu">
          <a class="nav-item is-tab" href="https://github.com/DaniloPolani/log-analyser" target="_blank">
            GitHub
          </a>
        </div>
      </div>
    </nav>
    <router-view ref="router"></router-view>
  </div>
</template>

<script>
  import _ from 'lodash'
  import * as moment from 'moment'

  export default {
    name: 'log-analyser',
    data () {
      return {
        inputFile: null,
        uploaded: false,
        loading: false,
        loading_text: '',
        methods_colors: {
          GET: 'info',
          POST: 'success',
          DELETE: 'danger',
          PUT: 'warning',
          PATCH: 'warning'
        },
        codes_colors: {
          200: 'success',
          301: 'info',
          302: 'warning',
          404: 'orange',
          500: 'danger'
        },
        codes_count: {
          '2xx': 0,
          '3xx': 0,
          '4xx': 0,
          '5xx': 0
        },
        codes_in_time: {},
        log_lines: [],
        log_lines_stats: []
      }
    },
    computed: {
      uniqueUrls () {
        return _.uniq(_.map(this.log_lines, 'url')).length
      },
      errors () {
        const c = _.filter(this.log_lines, line => line.plain_status.substr(0, 1) === '5').length + _.filter(this.log_lines, line => line.plain_status.substr(0, 1) === '4').length
        return c + ' (' + (c / this.uniqueUrls * 100).toFixed(2) + '%)'
      },
      avgSize () {
        return _.meanBy(this.log_lines, 'size')
      }
    },
    methods: {
      /**
       * Read file line by line
       *
       * @param string filePath
       */
      readFile (filePath) {
        const $vm = this
        const fs = require('fs')

        // Show loading
        $vm.loading = true
        // Init empty array as file content
        $vm.log_lines = []
        // Init empty object as stats
        $vm.log_lines_stats = {}
        // Set uploaded to false
        $vm.uploaded = false

        // Used to stop lineReader if error
        let error = false
        // Line number, if error
        let lineNumber = 0

        // Count total lines
        let countLines = 0
        fs.createReadStream(filePath).on('data', function (chunk) {
          for (let i = 0; i < chunk.length; ++i) {
            if (chunk[i] === 10) countLines++
          }
        }).on('end', function () {
          // Read file and process line-by-line
          const lineReader = require('readline').createInterface({
            input: fs.createReadStream(filePath)
          })

          // Average bytes length
          let avgUrlBytes = {}

          // 7 days ago moment
          const weekAgo = moment().subtract(7, 'days')

          lineReader.on('line', function (line) {
            if (!error) {
              lineNumber++
              $vm.loading_text = lineNumber + ' / ' + countLines

              try {
                let ip = line.match(/^\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}/)[0]
                let date = line.match(/(?:\[)(.*)(?:\])/)[0].replace('[', '').replace(']', '')
                if (date.indexOf(' +') > 0) {
                  date = date.split(' ')[0].replace(':', ' ') // Replace just the first which separates date from time
                }
                let [request, referer, agent] = line.match(/(?:")([^"]+)(?:")/g)
                request = request.replace(/"/g, '').split(' ')
                let method = request[0].toUpperCase()
                let url = request[1]
                let [status, size] = line.match(/(?:" ?)\d{3} \d+/)[0].replace('"', '').trim().split(' ')

                let methodColor = ($vm.methods_colors.hasOwnProperty(method) ? $vm.methods_colors[method] : 'dark')
                let statusColor = ($vm.codes_colors.hasOwnProperty(status) ? $vm.codes_colors[status] : 'dark')

                let logLine = {
                  line: lineNumber,
                  ip: ip,
                  date: date,
                  method: '<span class="tag is-' + methodColor + '">' + method + '</span>',
                  plain_method: method,
                  url: url,
                  status: '<span class="tag is-' + statusColor + '">' + status + '</span>',
                  plain_status: status,
                  size: parseInt(size),
                  referer: referer,
                  agent: agent.replace(/"/g, '')
                }

                // Key of line stats
                let methodUrlKey = '[' + method + ']' + url

                // Init an object if doesn't exist
                let logLineStats = {
                  ip: ip,
                  date: date,
                  url: url,
                  method: '<span class="tag is-' + methodColor + '">' + method + '</span>',
                  statuses: [],
                  last_status: 0,
                  referers: [],
                  last_referer: '',
                  agents: [],
                  last_agent: ''
                }
                // Or retrieve it if it exists
                if ($vm.log_lines_stats.hasOwnProperty(methodUrlKey)) {
                  logLineStats = $vm.log_lines_stats[methodUrlKey]
                }

                // Push new stats
                logLineStats.ip = ip
                logLineStats.date = date
                logLineStats.statuses.push(status)
                logLineStats.last_status = '<span class="tag is-' + statusColor + '">' + status + '</span>'
                logLineStats.referers.push(referer)
                logLineStats.last_referer = referer
                logLineStats.agents.push(agent)
                logLineStats.last_agent = agent

                // Push bytes length
                if (!avgUrlBytes.hasOwnProperty(methodUrlKey)) {
                  avgUrlBytes[methodUrlKey] = []
                }
                avgUrlBytes[methodUrlKey].push(size)

                // Increment correct status code stats
                if (parseInt(status) >= 200 && parseInt(status) < 600) {
                  let codeRange = status.toString().substr(0, 1)
                  $vm.codes_count[codeRange + 'xx']++

                  // Add errors in time only if in the last week
                  let momentDate = moment(date.split(' ')[0], 'DD/MMM/YYYY')
                  if (momentDate.isValid() && momentDate.isSameOrAfter(weekAgo)) {
                    let formattedDate = momentDate.format('DD MMM YYYY')

                    // Init empty object if it doesn't exists
                    if (!$vm.codes_in_time.hasOwnProperty(formattedDate)) {
                      $vm.codes_in_time[formattedDate] = {
                        '2xx': 0,
                        '3xx': 0,
                        '4xx': 0,
                        '5xx': 0
                      }
                    }

                    // Increment value
                    $vm.codes_in_time[formattedDate][codeRange + 'xx']++
                  }
                }

                // Append log line to file content
                $vm.log_lines.push(logLine)

                // Add to stats
                $vm.log_lines_stats[methodUrlKey] = logLineStats
              } catch (err) {
                console.log(err)
                $vm.$swal('File not valid', 'Error processing log at line ' + lineNumber + ': ' + line, 'error')
                error = true
              }
            }
          }).on('close', () => {
            $vm.log_lines_stats = Object.values($vm.log_lines_stats)
            // Hide loading
            $vm.loading = false
            // Set as uploaded
            $vm.uploaded = true
          })
        })
      } // readFile()
    },
    mounted () {
      // Set input file of children
      this.inputFile = this.$refs.router.$refs.file

      // Open links externally by default
      var shell = require('electron').shell
      document.querySelectorAll('a[href^="http"]').forEach(link => {
        link.addEventListener('click', e => {
          e.preventDefault()
          shell.openExternal(e.target.href)
        }, false)
      })
    }
  }
</script>

<style lang="scss">
  $fa-font-path: "~font-awesome/fonts";
  @import "~font-awesome/scss/font-awesome";

  html,
  body,
  #app {
    height: 100%;
  }

  .is-overlay {
    z-index: 1;

    &.global {
      background: rgba(0, 0, 0, .5);
      z-index: 2;

      .hero {
        background: none;
      }

      h3 {
        color: #fff;
        margin-top: 20px;
      }
    }
  }

  nav > .container {
    max-width: 100%;
  }
</style>

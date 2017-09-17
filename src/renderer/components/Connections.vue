<template>
  <div class="section no-padding is-fullheight">

    <!-- Context menu -->
    <context-menu ref="ctxMenu" @ctx-open="onCtxOpen">
      <div class="dropdown is-active">
        <div class="dropdown-menu" role="menu">
          <div class="dropdown-content">
            <a href="#" class="dropdown-item">
              Edit
            </a>
            <a class="dropdown-item">
              Test connection
            </a>
            <hr class="dropdown-divider">
            <a href="#" class="dropdown-item has-text-danger" @click="deleteConn()">
              Delete
            </a>
          </div>
        </div>
      </div>
    </context-menu>

    <div class="columns is-fullheight">
      <aside class="column is-one-quarter menu padding-top padding-left">
        <p class="menu-label has-text-weight-bold">Connections</p>
        <ul class="menu-list" v-if="$parent.connections.length > 0">
          <li v-for="(item, i) in $parent.connections" @contextmenu.prevent="$refs.ctxMenu.open($event, {i: i, item: item})">
            <a><button class="button" :class="'is-' + item.color">{{ item.name }}</button></a>
          </li>
        </ul>
        <small class="has-text-grey" v-else>No connection yet.</small>
      </aside>

      <main class="column padding-top padding-right">
        <form class="wrap">
          <section class="bordered">
            <!-- Connection name -->
            <div class="field is-horizontal">
              <div class="columns is-fullwidth">
                <div class="column is-4">
                  <div class="field-label is-normal">
                    <label class="label">Connection name</label>
                  </div>
                </div>
                <div class="field-body column">
                  <div class="field">
                    <div class="control">
                      <input class="input" type="text" placeholder="My connection" v-model="connection.name" required>
                    </div>
                  </div>
                </div>
              </div><!-- /.columns -->
              <div class="is-clearfix"></div>
            </div><!-- ./field -->

            <!-- Color -->
            <div class="field is-horizontal">
              <div class="columns is-fullwidth">
                <div class="column is-4">
                  <div class="field-label is-normal">
                    <label class="label">Color</label>
                  </div>
                </div>
                <div class="field-body column">
                  <div class="columns">
                    <div class="column has-text-centered">
                      <i class="fa fa-times vertical-middle pointer" @click="connection.color = null"></i>
                    </div>
                    <div class="column has-text-centered" v-for="c in ['turquoise', 'info', 'success', 'warning', 'danger']">
                      <div class="color button" :class="['is-' + c, {'active': c == connection.color}]" @click="connection.color = c"></div>
                    </div>
                  </div>
                </div>
              </div><!-- /.columns -->
              <div class="is-clearfix"></div>
            </div><!-- ./field -->

            <!-- Hostname -->
            <div class="field is-horizontal">
              <div class="columns is-fullwidth">
                <div class="column is-4">
                  <div class="field-label is-normal">
                    <label class="label">Hostname</label>
                  </div>
                </div>
                <div class="field-body column">
                  <div class="field">
                    <div class="control">
                      <input class="input" type="text" placeholder="127.0.0.1" v-model="connection.host" required>
                    </div>
                  </div>
                </div>
              </div><!-- /.columns -->
              <div class="is-clearfix"></div>
            </div><!-- ./field -->

            <!-- Hostname -->
            <div class="field is-horizontal">
              <div class="columns is-fullwidth">
                <div class="column is-4">
                  <div class="field-label is-normal">
                    <label class="label">Username</label>
                  </div>
                </div>
                <div class="field-body column">
                  <div class="field">
                    <div class="control">
                      <input class="input" type="text" placeholder="Username" v-model="connection.user" required>
                    </div>
                  </div>
                </div>
              </div><!-- /.columns -->
              <div class="is-clearfix"></div>
            </div><!-- ./field -->

            <!-- Password -->
            <div class="field is-horizontal">
              <div class="columns is-fullwidth">
                <div class="column is-4">
                  <div class="field-label is-normal">
                    <label class="label">Password</label>
                  </div>
                </div>
                <div class="field-body column">
                  <div class="field has-addons">
                    <p class="control is-fullwidth">
                      <input class="input" v-if="!show_password" type="password" v-model="connection.password" placeholder="Password">
                      <input class="input" v-if="show_password" type="text" v-model="connection.password" placeholder="Password">
                    </p>
                    <p class="control">
                      <button type="button" class="button" @click="show_password = !show_password">
                        <i class="fa" :class="{'fa-eye': !show_password, 'fa-eye-slash': show_password}"></i>
                      </button>
                    </p>
                  </div>
                </div>
              </div><!-- /.columns -->
              <div class="is-clearfix"></div>
            </div><!-- ./field -->

            <!-- Default schema -->
            <div class="field is-horizontal">
              <div class="columns is-fullwidth">
                <div class="column is-4">
                  <div class="field-label is-normal">
                    <label class="label">Default schema</label>
                  </div>
                </div>
                <div class="field-body column">
                  <div class="field">
                    <div class="control">
                      <input class="input" type="text" placeholder="my_db"  v-model="connection.database">
                    </div>
                  </div>
                </div>
              </div><!-- /.columns -->
              <div class="is-clearfix"></div>
            </div><!-- ./field -->
          </section>

          <!-- Buttons -->
          <div class="margin-top-10">
            <button type="button" class="button is-pulled-left action" v-if="!connecting" @click="test(connection)">
              Test connection
            </button>
            <p class="is-pulled-left has-text-grey" id="connecting-message" v-else>
              <span class="loader"></span>
              Connecting...
            </p>
            <button type="button" class="button is-info is-pulled-right action osx active" :disabled="connecting" @click="save(connection)">
              Save connection
            </button>
          </div>
        </form>
      </main>
    </div><!-- /.columns -->
  </div><!-- /.section -->
</template>

<script>
  import Connection from '../services/Connection'
  const settings = require('electron-settings')

  export default {
    name: 'connections',
    data: () => ({
      show_password: false,
      connecting: false,
      connection: {
        name: null,
        color: null,
        host: null,
        user: null,
        password: null,
        database: null
      },
      ctxData: {}
    }),

    created () {
      const conn = settings.get('connections')
      if (typeof conn !== 'undefined') {
        this.$parent.connections = conn
      }
    },

    methods: {
      /**
       * Test a connection
       *
       * @param {object} conn
       */
      test (conn) {
        let $vm = this

        Connection.connect(conn, false)
        .then(() => $vm.$swal('Success', 'Connection established correctly.', 'success'))
        .catch(err => $vm.$swal('Error', err, 'error'))
      },

      /**
       * Save a connection
       *
       * @param {object} conn
       * @param {int} i
       */
      save (conn, i = null) {
        if (i === null) { // If is new, push
          this.$parent.connections.push(conn)
        }

        // Update saved connections
        settings.set('connections', this.$parent.connections)

        this.connection = {
          name: null,
          color: null,
          host: null,
          user: null,
          password: null,
          database: null
        }
      },

      /**
       * Delete a connection
       */
      deleteConn () {
        this.$swal({
          title: 'Delete connection',
          text: 'Are you sure to want to delete the connection "' + this.ctxData.item.name + '"?',
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Delete it',
          cancelButtonText: 'Cancel',
          confirmButtonColor: '#fe385f'
        }).then(() => {
          this.$parent.connections.splice(this.ctxData.i, 1)
          settings.set('connections', this.$parent.connections)
        })
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
.wrap {
  width: 80%;
  margin: auto;
}
.wrap .bordered {
  background: #e4e4e4;
  border: 1px solid #dedede;
  border-radius: 3px;
  padding: 15px;

  > .field, > .field > .columns {
    margin-bottom: 0;
  }

  .field-label {
    margin-right: 0;
  }
}

.color {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  padding: 0;
  border: 1px solid rgba(0, 0, 0, .2) !important;
  line-height: normal;
  vertical-align: middle;

  &.active {
    border-color: rgba(0, 0, 0, 0.4) !important;
    width: 18px;
    height: 18px;

    &::before {
      position: absolute;
      width: 24px;
      height: 24px;
      left: -4px;
      top: -4px;
      content: '';
      border: 3px solid rgba(255, 255, 255, 0.5);
      border-radius: 50%;
    }

    &::after {
      position: absolute;
      width: 26px;
      height: 26px;
      left: -5px;
      top: -5px;
      content: '';
      border: 1px solid rgba(0, 0, 0, 0.3);
      border-radius: 50%;
    }
  }
}

#connecting-message {
  margin-top: 3px;

  .loader {
    display: inline-block;
    margin-right: 5px;
    border-left-color: hsl(0, 0%, 71%);
    border-bottom-color: hsl(0, 0%, 71%);
  }
}
</style>

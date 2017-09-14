<template>
  <div class="section no-padding is-fullheight">
    <div class="columns is-fullheight">
      <aside class="column is-one-quarter menu padding-top padding-left">
        <p class="menu-label"><strong>Connections</strong></p>
        <ul class="menu-list">
          <li><a href="#">Production</a></li>
          <li><a href="#">Local</a></li>
          <li><a href="#">John's</a></li>
        </ul>
      </aside>
      <main class="column padding-top padding-right">
        <form class="wrapping">
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
                    <input class="input" type="text" placeholder="My connection" required>
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
                    <i class="fa fa-times vertical-middle pointer" @click="color = null"></i>
                  </div>
                  <div class="column has-text-centered" v-for="c in ['primary', 'info', 'success', 'warning', 'danger']">
                    <div class="color button" :class="['is-' + c, {'active': c == color}]" @click="color = c"></div>
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
                    <input class="input" type="text" placeholder="127.0.0.1" required>
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
                    <input class="input" type="text" placeholder="Username" required>
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
                    <input class="input" :type="show_password ? 'text' : 'password'" placeholder="Password">
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
        </form>
        
        <!-- Buttons -->
        <div class="wrapping margin-top-10">
          <button type="button" class="button is-pulled-left">Test connection</button>
          <button type="button" class="button is-info is-pulled-right">Save connection</button>
        </div>
      </main>
    </div><!-- /.columns -->
  </div><!-- /.section -->
</template>

<script>
  export default {
    name: 'connections',
    data () {
      return {
        show_password: false,
        color: null
      }
    }
  }
</script>

<style lang="scss">
.wrapping {
  width: 80%;
  margin: auto;
}
form.wrapping {
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
</style>

const mysql = require('promise-mysql')

export default {
  ref: null,

  /**
   * Test a connection
   *
   * @param {object} conn
   * @return Promise
   */
  connect (conn, init = true) {
    let $vm = this

    return new Promise(function (resolve, reject) {
      // Create connection
      mysql.createConnection(conn)
      .then(res => {
        $vm.ref = res

        if (init) res.end()
        resolve(res)
      })
      .catch(err => {
        reject(err.message)
      })
    })
  }
}

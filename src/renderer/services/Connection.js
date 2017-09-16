const mysql = require('mysql')

export default {
  /**
   * Test a connection
   *
   * @param {object} conn
   * @return Promise
   */
  connect (conn, init = true) {
    return new Promise(function (resolve, reject) {
      // Create connection
      let connection = mysql.createConnection(conn)

      // Try to connect
      connection.connect(err => {
        if (err) {
          return reject(err.message)
        }

        resolve(connection)
      })
    })
  }
}

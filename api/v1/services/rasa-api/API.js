module.exports = function(request) {
  return function (params, callback) {
    request(params, (error, response, body) => {
      if (error) {
        return callback(error, null)
      }
      let json = {}
      try {
        json = JSON.parse(body)
      } catch(e) {
        return callback(e, null)
      }
      if (response && response.statusCode != '200') {
        const error = new Error("Falha")
        error.code = 500
        error.message = "Falha ao realizar consulta"
        return callback(error, null)
      }

      return callback(null, json)
    });
  }
}

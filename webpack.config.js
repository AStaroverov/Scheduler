module.exports = {
  entry: './Scheduler.es6.js',
  output: {
    filename: 'Scheduler.js',
    library: 'Scheduler',
    libraryTarget: "umd"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader'
      }
    ]
  }
}

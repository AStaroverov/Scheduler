import buble from 'rollup-plugin-buble'

export default {
  entry: './Scheduler.es6.js',
  dest: './Scheduler.js',
  moduleName: 'Scheduler',
  format: 'umd',
  plugins: [ buble() ]
}

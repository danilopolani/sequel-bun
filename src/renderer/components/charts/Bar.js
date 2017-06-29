import { Bar } from 'vue-chartjs'

export default Bar.extend({
  props: ['data', 'options'],
  mounted () {
    this.renderChart(this.data, this.options || {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: false
      },
      scales: {
        xAxes: [{
          barPercentage: 0.75,
          gridLines: {
            display: true
          }
        }],
        yAxes: [{
          gridLines: {
            display: true
          }
        }]
      }
    })
  }
})

const express = require('express')
const appInsights = require('applicationinsights')

let telemetryClient = null
const conn = process.env.APPINSIGHTS_CONNECTION_STRING || process.env.APPINSIGHTS_INSTRUMENTATIONKEY
if (conn) {
  appInsights
    .setup(conn)
    .setAutoCollectRequests(true)
    .setAutoCollectPerformance(true)
    .setAutoCollectExceptions(true)
    .setAutoCollectDependencies(true)
    .setAutoDependencyCorrelation(true)
    .start()
  telemetryClient = appInsights.defaultClient
}

const app = express()
let requestCount = 0

app.use((req, res, next) => {
  requestCount += 1
  console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl} count=${requestCount}`)
  if (telemetryClient) {
    telemetryClient.trackMetric({ name: 'requestCount', value: requestCount })
    telemetryClient.trackEvent({ name: 'request', properties: { method: req.method, url: req.originalUrl } })
  }
  next()
})

app.get('/', (req, res) => {
  res.type('text/plain').send('Aplikasi ini telah berhasil di-deploy dan scalable melalui Azure!')
})

app.get('/test', (req, res) => {
  res.json({ message: 'Server aktif dan scalable', timestamp: new Date().toISOString() })
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})

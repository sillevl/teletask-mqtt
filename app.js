const argv = require('minimist')(process.argv.slice(2))

let configfile = './settings.json'
if (argv.config) {
  configfile = argv.config
}

const settings = require(configfile)
const Teletask = require('node-teletask')

const teletask = new Teletask.connect(
  settings.teletask.host,
  settings.teletask.port,
  () => console.log(`Connected to TeleTask central (${settings.teletask.host}:${settings.teletask.port})`)
)

teletask.on('report', (report) => {
  const { fnc, number } = report
  const topic = `teletask/${fnc}/${number}`
  let message
  switch (Teletask.functions[fnc]) {
    case Teletask.functions.relay:
      message = report['status']
      break
    case Teletask.functions.sensor:
      message = report['temperature'].toFixed(1)
      break
    case Teletask.functions.dimmer:
      message = report['status'].toString()
      break
    default:
  }
  if (message) {
    console.log(`INFO: MQTT Publish at ${topic}: ${message}`)
    mqtt.publish(topic, message, { retain: true })
  } else {
    console.log(`WARNING: Function (${fnc}) not supported`)
  }
})

teletask.log(Teletask.functions.relay)
teletask.log(Teletask.functions.sensor)
teletask.log(Teletask.functions.dimmer)

const mqtt = require('mqtt').connect(settings.mqtt)

mqtt.on('connect', () => {
  console.log(`MQTT connected (${settings.mqtt.host}:${settings.mqtt.port})`)
  mqtt.subscribe('teletask/+/+/set')
})

mqtt.on('message', (topic, message) => {
  console.log(`INFO: MQTT message received on ${topic}: ${message}`)
  const fnc = topic.split('/')[1]
  const number = topic.split('/')[2]
  let value = ''
  switch (Teletask.functions[fnc]) {
    case Teletask.functions.relay:
      value =
        message.toString().toLowerCase() === 'on'
          ? Teletask.settings.on
          : Teletask.settings.off
      break
    case Teletask.functions.dimmer:
      value = parseInt(message)
      break
    default:
  }
  teletask.set(Teletask.functions[fnc], number, value)
})

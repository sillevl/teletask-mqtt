var settings = require('./settings.json');
var Teletask = require('node-teletask');

var mqtt  = require('mqtt').connect({ host: settings.mqtt.host, port: settings.mqtt.port })
var teletask = new Teletask.connect(settings.teletask.host,settings.teletask.port);

teletask.on("report", function(report){
  var topic = 'teletask/' + report['fnc'] + '/' + report['number'];
  var message = '';
  switch (Teletask.functions[report.fnc]) {
      case Teletask.functions.relay:
          message = report['status'];
          break;
      case Teletask.functions.sensor:
          message = report['temperature'].toFixed(1);
          break;
      default:

  }
  mqtt.publish(topic, message)
});

teletask.log(Teletask.functions.relay);
teletask.log(Teletask.functions.sensor);

mqtt.on('connect', function () {
    console.log("MQTT connected");
});

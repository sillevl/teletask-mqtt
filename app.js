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
		  case Teletask.functions.dimmer:
					message = report['status'].toString();
      default:

  }
	console.log(topic + ": " + message);
  mqtt.publish(topic, message, {retain: true})
});

teletask.log(Teletask.functions.relay);
teletask.log(Teletask.functions.sensor);
teletask.log(Teletask.functions.dimmer);

mqtt.on('connect', function () {
  console.log("MQTT connected");	
	mqtt.subscribe('teletask/+/+/set');
});

mqtt.on('message', function(topic, message) {
	console.log("SET received on " + topic + ": " + message);
	var fnc = topic.split('/')[1];
  var number = topic.split('/')[2];
	switch(Teletask.functions[fnc]) {
		case Teletask.functions.relay:
			var value = (message.toString().toLowerCase() == 'on') ? Teletask.settings.on : Teletask.settings.off;
			teletask.set(Teletask.functions[fnc], number, value);
			break;
	  case Teletask.functions.dimmer:
			var value = parseInt(message);
			teletask.set(Teletask.functions[fnc], number, value);
			break;
		default:
	}
});


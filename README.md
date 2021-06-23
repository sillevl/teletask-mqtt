# teletask-mqtt
MQTT bridge for Teletask

## Supported functions

* Sensor
* Relay
* Dimmer

## Functions not 'yet' supported

* Motor
* Local mood
* Time mood
* General mood
* Flags
* Audio
* Regime
* Service
* Message
* Condition

## Configuration file

```json
{
    "teletask": {
        "host": "192.168.1.1",
        "port": 55957
    },
    "mqtt": {
        "host": "192.168.1.2",
        "port": 1883
    }
}
```

If the broker is configured with a `username` and `password`, just add them to the `mqtt` object:

```json
{
    "teletask": {
        "host": "192.168.1.1",
        "port": 55957
    },
    "mqtt": {
        "host": "192.168.1.2",
        "port": 1883,
        "username": "foo",
        "password": "bar"
    }
}
```

## Docker

```
docker run -it -v /path-to-config:/config sillevl/teletask-mqtt
```

## MQTT Topics

### Subscribing

Listening for new values

```
teletask/[function]/[number]
```

example:

```
teletask/relay/20
```

This will subscribe to the state of relay 20

### Publishing

Updating state

```
teletask/relay/20/set
```

To change the state of relay 20, a value of `on` or `off` must be send to this topic

## Functions

### Relay

State values can be:

* on
* off

## Integration with Home Assitant

You can integrate the `teletask-mqtt` with Home Assitant by configuring the same MQTT broker for both services. You can use a separate MQTT broker, or the internal Home Assistant broker.

### Light example configuration

An example of integrating a `light` in the Home Assistant `configuration.yaml`

The number in the `topic`s should be configured with the number that is being assigned within the Teletask configuration.

```yaml
light:
  - platform: mqtt 
    command_topic: "teletask/relay/16/set"
    state_topic: "teletask/relay/16"
    name: Kitchen
    payload_on: "on"
    payload_off: "off"
    unique_id: "teletask/relay/16"
```

### Sensor example configuration

An example of integrating a `sensor` in the Home Assistant `configuration.yaml`

The number in the `topic`s should be configured with the number that is being assigned within the Teletask configuration.

```yaml
sensor:
  - platform: mqtt
    state_topic: "teletask/sensor/12"
    name: Kitchen
    unit_of_measurement: '°C'
```

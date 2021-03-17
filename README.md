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


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

## Docker

```
docker run -it -v /path-to-config:/config sillevl/teletask-mqtt
```

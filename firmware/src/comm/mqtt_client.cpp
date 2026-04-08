#include <Arduino.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include "mqtt_client.h"
#include "../config/secrets.h"

static WiFiClient   wifiClient;
static PubSubClient mqttClient(wifiClient);

static bool connectWiFi() {
    if (WiFi.status() == WL_CONNECTED) return true;

    Serial.printf("[WIFI] Connecting to \"%s\"...\n", WIFI_SSID);
    WiFi.mode(WIFI_STA);
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

    for (int i = 0; i < 20 && WiFi.status() != WL_CONNECTED; i++) {
        delay(500);
        Serial.print(".");
    }
    Serial.println();

    if (WiFi.status() != WL_CONNECTED) {
        Serial.println("[WIFI] ERROR: connection failed");
        return false;
    }

    Serial.printf("[WIFI] Connected. IP: %s\n", WiFi.localIP().toString().c_str());
    return true;
}

static bool connectMQTT() {
    if (mqttClient.connected()) return true;

    mqttClient.setServer(MQTT_HOST, MQTT_PORT);

    char clientId[32];
    snprintf(clientId, sizeof(clientId), "sambee-%s", HIVE_ID);

    Serial.printf("[MQTT] Connecting to %s:%d (id=%s)...\n", MQTT_HOST, MQTT_PORT, clientId);

    if (!mqttClient.connect(clientId)) {
        Serial.printf("[MQTT] ERROR: state=%d\n", mqttClient.state());
        return false;
    }

    Serial.println("[MQTT] Connected to broker");
    return true;
}

bool initComm() {
    return connectWiFi() && connectMQTT();
}

bool publishSensorData(const EnvironmentData& data) {
    if (!mqttClient.connected()) {
        Serial.println("[MQTT] Not connected — skipping publish");
        return false;
    }

    StaticJsonDocument<192> doc;
    doc["hive_id"]     = HIVE_ID;
    doc["temperature"] = serialized(String(data.temperature, 2));
    doc["humidity"]    = serialized(String(data.humidity, 2));
    doc["pressure"]    = serialized(String(data.pressure, 1));
    if (data.weight >= 0.0f) {
        doc["weight"] = serialized(String(data.weight, 3));
    }

    char payload[192];
    serializeJson(doc, payload, sizeof(payload));

    char topic[64];
    snprintf(topic, sizeof(topic), "hives/%s/sensors/environment", HIVE_ID);

    bool ok = mqttClient.publish(topic, payload, /*retained=*/false);
    if (ok) {
        Serial.printf("[MQTT] -> %s  %s\n", topic, payload);
    } else {
        Serial.println("[MQTT] ERROR: publish failed");
    }
    return ok;
}

void maintainComm() {
    if (WiFi.status() != WL_CONNECTED) {
        Serial.println("[WIFI] Connection lost, reconnecting...");
        connectWiFi();
    }
    if (!mqttClient.connected()) {
        Serial.println("[MQTT] Connection lost, reconnecting...");
        connectMQTT();
    }
    mqttClient.loop();
}

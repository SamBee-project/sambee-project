// src/comm/mqtt_client.cpp
#include <Arduino.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include "mqtt_client.h"
#include "../config/secrets.h"

static WiFiClient   wifiClient;
static PubSubClient mqttClient(wifiClient);

// ---------- WiFi ----------

static bool connectWiFi() {
    if (WiFi.status() == WL_CONNECTED) return true;

    Serial.printf("[WIFI] Підключення до \"%s\"...\n", WIFI_SSID);
    WiFi.mode(WIFI_STA);
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

    for (int i = 0; i < 20 && WiFi.status() != WL_CONNECTED; i++) {
        delay(500);
        Serial.print(".");
    }
    Serial.println();

    if (WiFi.status() != WL_CONNECTED) {
        Serial.println("[WIFI] ERROR: не вдалося підключитися");
        return false;
    }

    Serial.printf("[WIFI] OK. IP: %s\n", WiFi.localIP().toString().c_str());
    return true;
}

// ---------- MQTT ----------

static bool connectMQTT() {
    if (mqttClient.connected()) return true;

    mqttClient.setServer(MQTT_HOST, MQTT_PORT);

    // Client ID унікальний на основі HIVE_ID
    char clientId[32];
    snprintf(clientId, sizeof(clientId), "sambee-%s", HIVE_ID);

    Serial.printf("[MQTT] Підключення до %s:%d (id=%s)...\n",
                  MQTT_HOST, MQTT_PORT, clientId);

    if (!mqttClient.connect(clientId)) {
        Serial.printf("[MQTT] ERROR: стан=%d\n", mqttClient.state());
        return false;
    }

    Serial.println("[MQTT] OK. Підключено до брокера");
    return true;
}

// ---------- Public API ----------

bool initComm() {
    return connectWiFi() && connectMQTT();
}

bool publishSensorData(const EnvironmentData& data) {
    if (!mqttClient.connected()) {
        Serial.println("[MQTT] Не підключено — пропускаємо");
        return false;
    }

    // Формуємо JSON
    StaticJsonDocument<128> doc;
    doc["hive_id"]     = HIVE_ID;
    doc["temperature"] = serialized(String(data.temperature, 2));
    doc["humidity"]    = serialized(String(data.humidity, 2));
    doc["pressure"]    = serialized(String(data.pressure, 1));

    char payload[128];
    serializeJson(doc, payload, sizeof(payload));

    // Топік: hives/hive_01/sensors/environment
    char topic[64];
    snprintf(topic, sizeof(topic), "hives/%s/sensors/environment", HIVE_ID);

    bool ok = mqttClient.publish(topic, payload, /*retained=*/false);
    if (ok) {
        Serial.printf("[MQTT] → %s  %s\n", topic, payload);
    } else {
        Serial.println("[MQTT] ERROR: publish не вдався");
    }
    return ok;
}

void maintainComm() {
    if (WiFi.status() != WL_CONNECTED) {
        Serial.println("[WIFI] З'єднання втрачено, повторна спроба...");
        connectWiFi();
    }
    if (!mqttClient.connected()) {
        Serial.println("[MQTT] З'єднання втрачено, повторна спроба...");
        connectMQTT();
    }
    mqttClient.loop();
}

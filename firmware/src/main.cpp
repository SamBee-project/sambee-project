#include <Arduino.h>
#include "sensors/temperature.h"
#include "sensors/weight.h"
#include "comm/mqtt_client.h"

#define PUBLISH_INTERVAL_MS 5000

static unsigned long lastPublishMs = 0;

void setup() {
    Serial.begin(115200);
    delay(2000);

    Serial.println("\n=== Smart Hive — boot ===");

    if (!initEnvironmentSensor()) {
        Serial.println("[MAIN] FATAL: env sensor init failed");
        while (true) { delay(1000); }
    }

    if (!initWeightSensor()) {
        Serial.println("[MAIN] WARN: weight sensor init failed — weight will not be sent");
    }

    if (!initComm()) {
        Serial.println("[MAIN] WARN: no connection — data will not be sent");
    }

    Serial.println("[MAIN] Ready.\n");
}

void loop() {
    maintainComm();

    unsigned long now = millis();
    if (now - lastPublishMs >= PUBLISH_INTERVAL_MS) {
        lastPublishMs = now;

        EnvironmentData data = readEnvironment();
        if (data.valid) {
            data.weight = readWeight();
            publishSensorData(data);
        } else {
            Serial.println("[MAIN] Reading skipped — sensor error");
        }
    }
}

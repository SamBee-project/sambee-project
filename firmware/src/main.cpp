// src/main.cpp
#include <Arduino.h>
#include "sensors/temperature.h"
#include "comm/mqtt_client.h"

#define PUBLISH_INTERVAL_MS 5000  // відправляємо кожні 30 секунд

static unsigned long lastPublishMs = 0;

void setup() {
    Serial.begin(115200);
    delay(2000);

    Serial.println("\n=== Smart Hive — старт ===");

    if (!initEnvironmentSensor()) {
        Serial.println("[MAIN] FATAL: датчик не ініціалізовано");
        while (true) { delay(1000); }
    }

    if (!initComm()) {
        Serial.println("[MAIN] WARN: немає з'єднання — дані не передаватимуться");
        // Не зупиняємося — може підключитися пізніше через maintainComm()
    }

    Serial.println("[MAIN] Готово. Відправка кожні 30 с.\n");
}

void loop() {
    maintainComm();

    unsigned long now = millis();
    if (now - lastPublishMs >= PUBLISH_INTERVAL_MS) {
        lastPublishMs = now;

        EnvironmentData data = readEnvironment();
        if (data.valid) {
            publishSensorData(data);
        } else {
            Serial.println("[MAIN] Показник пропущено — датчик повернув помилку");
        }
    }
}

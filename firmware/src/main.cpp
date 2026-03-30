// src/main.cpp
#include <Arduino.h>
#include "sensors/temperature.h"

static int readingCount = 0;

void setup() {
    Serial.begin(115200);
    delay(2000);

    Serial.println("\n=== Smart Hive — BME280 Smoke Test ===");
    Serial.println("Плата:   ESP32-S3-DevKitC-1");
    Serial.println("Датчик:  BME280 (temp + humidity + pressure)");
    Serial.println("I²C:     SDA=GPIO8, SCL=GPIO9");
    Serial.println("======================================\n");

    if (!initEnvironmentSensor()) {
        Serial.println("[MAIN] Зупинка — датчик не ініціалізовано");
        while (true) { delay(1000); }
    }

    Serial.println("[MAIN] Smoke test: 10 показників кожні 3 секунди\n");
}

void loop() {
    if (readingCount >= 10) {
        Serial.println("\n=== Smoke test завершено ===");
        Serial.println("Всі показники отримано — датчик працює коректно.");
        while (true) { delay(1000); }
    }

    EnvironmentData data = readEnvironment();
    readingCount++;

    if (data.valid) {
        Serial.printf("[%2d/10] T: %5.2f°C  |  RH: %5.2f%%  |  P: %.1f hPa\n",
                      readingCount,
                      data.temperature,
                      data.humidity,
                      data.pressure);
    } else {
        Serial.printf("[%2d/10] ПОМИЛКА — показник пропущено\n", readingCount);
    }

    delay(3000);
}
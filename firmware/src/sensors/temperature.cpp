// src/sensors/temperature.cpp
#include <Arduino.h>
#include "temperature.h"
#include <Adafruit_BME280.h>
#include <Wire.h>

// I²C піни для ESP32-WROOM
#define I2C_SDA 21
#define I2C_SCL 22

// BME280 може мати адресу 0x76 або 0x77
// На більшості китайських модулів — 0x76
#define BME280_I2C_ADDR 0x76

static Adafruit_BME280 bme;

bool initEnvironmentSensor() {
    // Явно ініціалізуємо I²C з правильними пінами для S3
    Wire.begin(I2C_SDA, I2C_SCL);

    // Спочатку пробуємо 0x76
    bool status = bme.begin(BME280_I2C_ADDR, &Wire);

    // Якщо не знайшло — пробуємо 0x77
    if (!status) {
        Serial.println("[ENV] 0x76 не відповідає, пробуємо 0x77...");
        status = bme.begin(0x77, &Wire);
    }

    if (!status) {
        Serial.println("[ENV] ERROR: BME280 не знайдено");
        Serial.println("[ENV] Перевір: SDA->GPIO21, SCL->GPIO22, VCC->3.3V");
        return false;
    }

    // Налаштування для вулика — стабільні покази важливіші за швидкість
    bme.setSampling(
        Adafruit_BME280::MODE_FORCED,     // вимір тільки за запитом
        Adafruit_BME280::SAMPLING_X1,     // температура — 1x
        Adafruit_BME280::SAMPLING_X1,     // тиск — 1x
        Adafruit_BME280::SAMPLING_X1,     // вологість — 1x
        Adafruit_BME280::FILTER_OFF
    );

    Serial.println("[ENV] BME280 ініціалізовано успішно");
    return true;
}

EnvironmentData readEnvironment() {
    EnvironmentData result = {0, 0, 0, false};

    // FORCED mode — треба запустити вимір вручну
    bme.takeForcedMeasurement();

    float temp = bme.readTemperature();
    float hum  = bme.readHumidity();
    float pres = bme.readPressure() / 100.0F; // Па → гПа

    // Перевірка NaN
    if (isnan(temp) || isnan(hum) || isnan(pres)) {
        Serial.println("[ENV] ERROR: отримано NaN");
        return result;
    }

    // Перевірка фізичних меж
    if (temp < -40.0 || temp > 85.0) {
        Serial.printf("[ENV] WARN: T поза межами: %.1f°C\n", temp);
        return result;
    }
    if (hum < 0.0 || hum > 100.0) {
        Serial.printf("[ENV] WARN: RH поза межами: %.1f%%\n", hum);
        return result;
    }
    if (pres < 300.0 || pres > 1100.0) {
        Serial.printf("[ENV] WARN: P поза межами: %.1f hPa\n", pres);
        return result;
    }

    result.temperature = temp;
    result.humidity    = hum;
    result.pressure    = pres;
    result.valid       = true;
    return result;
}
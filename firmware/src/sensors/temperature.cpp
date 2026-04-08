#include <Arduino.h>
#include "temperature.h"
#include <Adafruit_BME280.h>
#include <Wire.h>

// I2C pins for ESP32-WROOM
#define I2C_SDA 21
#define I2C_SCL 22

// BME280 default address is 0x76; some modules use 0x77
#define BME280_I2C_ADDR 0x76

static Adafruit_BME280 bme;

bool initEnvironmentSensor() {
    Wire.begin(I2C_SDA, I2C_SCL);

    bool status = bme.begin(BME280_I2C_ADDR, &Wire);
    if (!status) {
        Serial.println("[ENV] 0x76 not responding, trying 0x77...");
        status = bme.begin(0x77, &Wire);
    }

    if (!status) {
        Serial.println("[ENV] ERROR: BME280 not found");
        Serial.println("[ENV] Check: SDA->GPIO21, SCL->GPIO22, VCC->3.3V");
        return false;
    }

    // Forced mode: measure on demand for stable hive readings
    bme.setSampling(
        Adafruit_BME280::MODE_FORCED,
        Adafruit_BME280::SAMPLING_X1,
        Adafruit_BME280::SAMPLING_X1,
        Adafruit_BME280::SAMPLING_X1,
        Adafruit_BME280::FILTER_OFF
    );

    Serial.println("[ENV] BME280 initialized");
    return true;
}

EnvironmentData readEnvironment() {
    EnvironmentData result = {0, 0, 0, -1.0f, false};

    bme.takeForcedMeasurement();

    float temp = bme.readTemperature();
    float hum  = bme.readHumidity();
    float pres = bme.readPressure() / 100.0F; // Pa -> hPa

    if (isnan(temp) || isnan(hum) || isnan(pres)) {
        Serial.println("[ENV] ERROR: NaN reading");
        return result;
    }

    if (temp < -40.0 || temp > 85.0) {
        Serial.printf("[ENV] WARN: temperature out of range: %.1f C\n", temp);
        return result;
    }
    if (hum < 0.0 || hum > 100.0) {
        Serial.printf("[ENV] WARN: humidity out of range: %.1f%%\n", hum);
        return result;
    }
    if (pres < 300.0 || pres > 1100.0) {
        Serial.printf("[ENV] WARN: pressure out of range: %.1f hPa\n", pres);
        return result;
    }

    result.temperature = temp;
    result.humidity    = hum;
    result.pressure    = pres;
    result.valid       = true;
    return result;
}

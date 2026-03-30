// src/sensors/temperature.h
#pragma once
#include <Arduino.h>

// Всі показники BME280 в одній структурі
struct EnvironmentData {
    float temperature;  // °C
    float humidity;     // %
    float pressure;     // hPa
    bool  valid;        // false якщо датчик не відповів
};

bool          initEnvironmentSensor();
EnvironmentData readEnvironment();
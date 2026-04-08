#pragma once
#include <Arduino.h>

struct EnvironmentData {
    float temperature;
    float humidity;
    float pressure;
    bool  valid;
};

bool initEnvironmentSensor();
EnvironmentData readEnvironment();

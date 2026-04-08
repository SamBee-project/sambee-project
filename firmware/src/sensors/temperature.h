#pragma once
#include <Arduino.h>

struct EnvironmentData {
    float temperature;
    float humidity;
    float pressure;
    float weight;
    bool  valid;
};

bool initEnvironmentSensor();
EnvironmentData readEnvironment();

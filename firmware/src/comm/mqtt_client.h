#pragma once
#include "sensors/temperature.h"

bool initComm();

bool publishSensorData(const EnvironmentData& data);
void maintainComm();

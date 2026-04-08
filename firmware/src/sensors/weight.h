#pragma once
#include <Arduino.h>

// HX711 wiring:
//   DOUT -> GPIO16
//   SCK  -> GPIO17
//   VCC  -> 3.3V or 5V (check your module)
//   GND  -> GND
//
// Load cells: 4 x 50 kg in a full Wheatstone bridge -> one HX711

bool  initWeightSensor();
float readWeight();          // Returns kg >= 0.0, or -1.0 on error

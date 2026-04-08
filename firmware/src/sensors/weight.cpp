#include "weight.h"
#include <HX711.h>
#include "../config/secrets.h"

#define HX711_DOUT 16
#define HX711_SCK  17

#define WEIGHT_MAX_KG    200.0f
#define SAMPLES_PER_READ 10      // averaged internally by HX711 lib (~1 s at 10 SPS)
#define EMA_ALPHA        0.2f    // smoothing factor: lower = smoother but slower response

static HX711  scale;
static float  emaValue   = -1.0f; // -1 = not yet initialized
static bool   weightReady = false;

bool initWeightSensor() {
    scale.begin(HX711_DOUT, HX711_SCK);

    if (!scale.is_ready()) {
        Serial.println("[WEIGHT] ERROR: HX711 not responding");
        Serial.println("[WEIGHT] Check: DOUT->GPIO16, SCK->GPIO17, VCC, GND");
        return false;
    }

    scale.set_scale(WEIGHT_CALIBRATION_FACTOR);
    scale.tare(SAMPLES_PER_READ);

    weightReady = true;
    Serial.printf("[WEIGHT] HX711 initialized (factor=%.2f), tare done\n",
                  (float)WEIGHT_CALIBRATION_FACTOR);
    return true;
}

float readWeight() {
    if (!weightReady || !scale.is_ready()) {
        Serial.println("[WEIGHT] ERROR: HX711 not ready");
        return -1.0f;
    }

    float raw = scale.get_units(SAMPLES_PER_READ);

    // Clamp small negatives (noise around zero after tare)
    if (raw < 0.0f) raw = 0.0f;

    if (raw > WEIGHT_MAX_KG) {
        Serial.printf("[WEIGHT] WARN: reading out of range: %.3f kg\n", raw);
        return -1.0f;
    }

    // Exponential moving average across publish cycles
    if (emaValue < 0.0f) {
        emaValue = raw; // first valid reading — seed the filter
    } else {
        emaValue = EMA_ALPHA * raw + (1.0f - EMA_ALPHA) * emaValue;
    }

    Serial.printf("[WEIGHT] raw=%.3f kg  ema=%.3f kg\n", raw, emaValue);
    return emaValue;
}

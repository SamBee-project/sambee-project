import asyncio
import json
import logging
import os

import aiomqtt
from sqlalchemy import insert

from app.db.session import AsyncSessionLocal
from app.models.sensor_reading import SensorReading

logger = logging.getLogger(__name__)

MQTT_HOST = os.getenv("MQTT_HOST", "localhost")
MQTT_PORT = int(os.getenv("MQTT_PORT", "1883"))
TOPIC = "hives/+/sensors/environment"

async def mqtt_subscriber() -> None:
    """Безкінечний цикл: слухає MQTT і зберігає дані в БД."""
    while True:
        try:
            logger.info(
                f"[MQTT] Підключення до {MQTT_HOST}:{MQTT_PORT}...")
            async with aiomqtt.Client(MQTT_HOST, port=MQTT_PORT) as client:
                await client.subscribe(TOPIC)
                logger.info(f"[MQTT] Підписано на {TOPIC}")
                async for message in client.messages:
                    await _handle_message(message)
        except aiomqtt.MqttError as e:
            logger.warning(
                f"[MQTT] З'єднання втрачено: {e}. Повтор через 5 с...")
            await asyncio.sleep(5)

async def _handle_message(message: aiomqtt.Message) -> None:
    try:
        data = json.loads(message.payload)
        hive_id = int(data["hive_id"])
        temperature = float(data["temperature"])
        humidity = float(data["humidity"])
        pressure = float(data["pressure"])
    except (KeyError, ValueError, json.JSONDecodeError) as e:
        logger.error(
            f"[MQTT] Невалідний payload: {message.payload!r} — {e}")
        return

    weight = None
    if "weight" in data:
        try:
            weight = float(data["weight"])
        except ValueError:
            logger.warning(f"[MQTT] Не вдалося розпарсити weight: {data['weight']!r}")

    async with AsyncSessionLocal() as session:
        await session.execute(
            insert(SensorReading).values(
                hive_id=hive_id,
                temperature=temperature,
                humidity=humidity,
                pressure=pressure,
                weight=weight,
            )
        )
        await session.commit()

    weight_str = f"{weight:.3f} kg" if weight is not None else "N/A"
    logger.info(
        f"[MQTT] Збережено: {hive_id} | T={temperature} RH={humidity} P={pressure} W={weight_str}")

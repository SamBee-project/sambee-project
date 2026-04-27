import cv2
import json
import os
import time
from datetime import datetime
from ultralytics import YOLO


def load_model(model_path):
    """Load the pre-trained YOLO model."""
    return YOLO(model_path)

<<<<<<< HEAD
def setup_camera(cam_url):
    """Establish connection with ESP32-CAM video stream."""
    cap = cv2.VideoCapture(cam_url)

    if not cap.isOpened():
        raise Exception("Failed to connect to stream")

    return cap

def get_video_slice(cap, next_time, interval):
    """Slicing function: captures a frame and checks if enough time has passed."""
    ret, frame = cap.read()
>>>>>>> bb382a4 (feat: fixed bags and add payload func for backend)
    ret, frame = cap.read()
    if not ret:
        return False, None, next_time

    current_time = time.time()

    if current_time >= next_time:
        next_time += interval
        return True, frame, next_time

    return False, None, next_time

def analyze_frame(model, frame):
    """Run AI detection and counts bees/mites."""
    results = model(frame, verbose=False)

    counts = {"bee": 0, "varroa": 0}

    for result in results:
        if result.boxes is None:
            continue

        for box in result.boxes:
            class_id = int(box.cls.item())
            label = model.names[class_id].lower()

            if label == "varroa":
                counts["varroa"] += 1
            elif label == "bee":
                counts["bee"] += 1

    annotated_frame = results[0].plot()

    return counts, annotated_frame

def build_payload(stats):
    """
    Build data object to send to backend
    """
    total_bees = stats.get("total_bees", 0)
    total_varroa = stats.get("total_varroa", 0)

    infestation_rate = 0
    if total_bees > 0:
        infestation_rate = round((total_varroa / total_bees) * 100, 2)

    payload = {
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "total_bees": total_bees,
        "total_varroa": total_varroa,
        "infestation_rate_percent": infestation_rate
    }

    return payload

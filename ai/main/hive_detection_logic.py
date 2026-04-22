import cv2
import json
import os
import time
from datetime import datetime 
from ultralytics import YOLO


def load_model(model_path):
    """Load the pre-trained YOLO model."""
    return YOLO(model_path)

def setup_camera(cam_url):
    """Establish connection with ESP32-CAM video stream."""
    return cv2.VideoCapture(cam_url)

def get_video_slice(cap, prev_time, interval):
    """Slicing fuction: captures a frame and checks if enough time has passes"""
    ret, frame = cap.read()
    if not ret:
        return False, None, prev_time

    current_time = time.time()
    if current_time - prev_time >= interval:
        return True, frame, current_time

    return False, None, prev_time

def analyze_frame(model, frame):
    """Run AI detection and counts bees/mites."""
    results = model(frame, verbose=False)
    counts = {"bee": 0, "varroa": 0}

    for result in results:
        for box in result.boxes:
            class_id = int(box.cls[0])
            label = model.names[class_id].lower()
            if "varroa" in label:
                counts["varroa"] += 1
            elif "bee" in label:
                counts["bee"] += 1
    
    return counts, results[0].plot()


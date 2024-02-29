import time
import cv2
import numpy as np
from shapely.geometry import Polygon
import json
# import requests  # Uncomment if you plan to use requests for API calls

# Load YOLOv3 model and configuration
net = cv2.dnn.readNet("./darknet/yolov3.weights", "./darknet/cfg/yolov3.cfg")

# Load COCO class names
classes = []
with open("./darknet/data/coco.names", "r") as f:
    classes = f.read().strip().split("\n")

# Load saved parking spot data from regions.json file
apiUrl = 'http://localhost:8000/api/'
spots_format = []
id = 0
with open("regions.json", "r") as f:
    data = json.load(f)
    if "parkingSpaces" in data:
        spots_format = data["parkingSpaces"]
        for parking_space in spots_format:
            id += 1
            parking_space["status"] = "available"
            parking_space["id"] = id

# Function to check if car is in a parking spot
def is_car_in_spot(car_polygon, spot):
    # Convert the flat list of coordinates into a list of (x, y) tuples
    spot_coords = spot["position"]
    spot_polygon_coords = [(spot_coords[i], spot_coords[i + 1]) for i in range(0, len(spot_coords), 2)]
    spot_polygon = Polygon(spot_polygon_coords)
    return spot_polygon.intersects(car_polygon)

# Initialize video capture from the RTSP stream
cap = cv2.VideoCapture("rtsp://parking1admin:jaitpgvarna2000@192.168.1.14:554/stream1")

# Initialize variables for managing frame capture interval
frame_interval = 0.1  # Interval between frames in seconds
next_frame_time = time.time() + frame_interval

while True:
    current_time = time.time()
    if current_time >= next_frame_time:
        ret, frame = cap.read()
        if not ret:
            print("Failed to grab frame")
            break

        # Detect objects using YOLO
        blob = cv2.dnn.blobFromImage(frame, 1 / 255.0, (416, 416), swapRB=True, crop=False)
        net.setInput(blob)
        output_layers = net.forward(net.getUnconnectedOutLayersNames())

        # Post-process YOLO output
        for output in output_layers:
            for detection in output:
                scores = detection[5:]  # Class confidence scores start from the 6th element
                class_id = np.argmax(scores)
                confidence = scores[class_id]

                if confidence > 0.5:
                    center_x = int(detection[0] * frame.shape[1])
                    center_y = int(detection[1] * frame.shape[0])
                    width = int(detection[2] * frame.shape[1])
                    height = int(detection[3] * frame.shape[0])

                    x = int(center_x - width / 2)
                    y = int(center_y - height / 2)

                    car_polygon = Polygon([(x, y), (x + width, y), (x + width, y + height), (x, y + height)])
                    for spot in spots_format:
                        if is_car_in_spot(car_polygon, spot):
                            spot["status"] = "taken"
                            cv2.rectangle(frame, (x, y), (x + width, y + height), (128, 0, 128), 2)
                            break
                    else:
                        cv2.rectangle(frame, (x, y), (x + width, y + height), (0, 255, 0), 2)
                    cv2.putText(frame, f"{confidence:.2f}", (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

        # Update the time for the next frame capture
        next_frame_time = current_time + frame_interval

        # Display the frame with detected objects
        cv2.imshow("Parking system", frame)

    # Implement the countdown timer for the UI or terminal display
    countdown = int(next_frame_time - time.time())
    print(f"Time until next frame: {countdown} seconds", end='\r')

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

# Release video capture and close the window
cap.release()
cv2.destroyAllWindows()

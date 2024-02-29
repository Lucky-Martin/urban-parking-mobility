import cv2
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.patches import Polygon
from matplotlib.collections import PatchCollection
from matplotlib.widgets import PolygonSelector
import json
import argparse

points = []
prev_points = []
patches = []
parking_spaces = []

class SelectFromCollection(object):
    def __init__(self, ax):
        self.canvas = ax.figure.canvas
        self.poly = PolygonSelector(ax, self.onselect)
        self.ind = []

    def onselect(self, verts):
        global points
        points = verts
        self.canvas.draw_idle()

    def disconnect(self):
        self.poly.disconnect_events()
        self.canvas.draw_idle()

def onkeypress(event):
    global points, prev_points, parking_spaces
    if event.key == 'n':
        pts = np.array(points, dtype=np.int32)
        if points != prev_points and len(set(points)) == 4:
            parking_space = {'position': pts.flatten().tolist()}
            parking_spaces.append(parking_space)
            patches.append(Polygon(pts))
            prev_points = points

def break_loop(event):
    global parking_spaces
    if event.key == 'b':
        globSelect.disconnect()
        with open(savePath, 'w') as f:
            json.dump({"parkingSpaces": parking_spaces}, f, indent=4)
        print("Data saved in " + savePath + " file")
        plt.close()

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('video_path', help="Path of video file or RTSP stream URL")
    parser.add_argument('--out_file', help="Name of the output file", default="regions.json")
    args = parser.parse_args()

    global globSelect
    global savePath
    savePath = args.out_file if args.out_file.endswith(".json") else args.out_file + ".json"

    video_capture = cv2.VideoCapture(args.video_path)
    if not video_capture.isOpened():
        print("Error: Could not open video stream.")
        exit()

    cnt = 0
    rgb_image = None
    while video_capture.isOpened():
        ret, frame = video_capture.read()
        if not ret:
            print("Failed to grab frame")
            break
        if cnt == 5:  # Adjust this value as needed
            rgb_image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            break
        cnt += 1
    video_capture.release()

    if rgb_image is not None:
        fig, ax = plt.subplots()
        ax.imshow(rgb_image)
        globSelect = SelectFromCollection(ax)
        plt.connect('key_press_event', onkeypress)
        plt.connect('key_press_event', break_loop)
        plt.show()
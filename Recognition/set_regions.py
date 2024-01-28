import argparse
import cv2
import matplotlib.pyplot as plt
import numpy as np
from matplotlib.collections import PatchCollection
from matplotlib.patches import Polygon
from matplotlib.widgets import PolygonSelector
import json

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

def break_loop(event):
    global parking_spaces
    if event.key == 'b':
        globSelect.disconnect()
        with open(savePath, 'w') as f:
            json.dump({"parkingSpaces": parking_spaces}, f, indent=4)
        print("Data saved in " + savePath + " file")
        exit()

def onkeypress(event):
    global points, prev_points, parking_spaces
    if event.key == 'n':
        pts = np.array(points, dtype=np.int32)
        if points != prev_points and len(set(points)) == 4:
            print("Points : " + str(pts))
            parking_space = {'position': pts.flatten().tolist()}
            parking_spaces.append(parking_space)
            patches.append(Polygon(pts))
            prev_points = points

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('video_path', help="Path of video file")
    parser.add_argument('--out_file', help="Name of the output file", default="regions.json")
    args = parser.parse_args()

    global globSelect
    global savePath
    savePath = args.out_file if args.out_file.endswith(".json") else args.out_file + ".json"

    print("\n> Select a region in the figure by enclosing them within a quadrilateral.")
    print("> Press the 'f' key to go full screen.")
    print("> Press the 'esc' key to discard the current quadrilateral.")
    print("> Try holding the 'shift' key to move all of the vertices.")
    print("> Try holding the 'ctrl' key to move a single vertex.")
    print(
        "> After marking a quadrilateral press 'n' to save the current quadrilateral and then press 'q' to start marking a new quadrilateral")
    print("> When you are done press 'b' to exit the program\n")

    video_capture = cv2.VideoCapture(args.video_path)
    cnt = 0
    rgb_image = None
    while video_capture.isOpened():
        success, frame = video_capture.read()
        if not success:
            break
        if cnt == 5:
            rgb_image = frame[:, :, ::-1]
        cnt += 1
    video_capture.release()

    while True:
        fig, ax = plt.subplots()
        image = rgb_image
        ax.imshow(image)
        fig.set_size_inches(12.8, 7.2)

        p = PatchCollection(patches, alpha=0.7)
        p.set_array(10 * np.ones(len(patches)))
        ax.add_collection(p)

        globSelect = SelectFromCollection(ax)
        bbox = plt.connect('key_press_event', onkeypress)
        break_event = plt.connect('key_press_event', break_loop)
        # plt.set_size_inches(12.8, 7.2)
        plt.show()
        globSelect.disconnect()

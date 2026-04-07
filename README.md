# StarkCrosshair

A customizable crosshair overlay app for gamers built with Electron.

## Features
- 6 crosshair styles Cross, Cross+, Dot, Circle, Corner, Star
- Custom colors and sizes
- Save and load presets
- F2 to cycle through presets
- F3 to toggle crosshair onoff
- Works on top of any game (borderless windowed)

## Download
Check the Releases section to download the latest .exe

⚠️ Windows may show a SmartScreen warning.
Click "More info" then "Run anyway" — this is safe!
This happens because the app is new and not yet signed.





## The Story
This project started as a simple Python script using tkinter:
```python
import tkinter as tk

root = tk.Tk()
root.attributes("-fullscreen", True)
root.attributes("-transparentcolor", "black")
root.attributes("-topmost", True)
root.config(bg="black")
root.overrideredirect(True)

canvas = tk.Canvas(root, bg="black", highlightthickness=0)
canvas.pack(fill="both", expand=True)

sw = root.winfo_screenwidth()
sh = root.winfo_screenheight()
cx = sw // 2
cy = sh // 2

GAP = 7
LENGTH = 6
THICKNESS = 2
COLOR = "white"

canvas.create_line(cx - GAP - LENGTH, cy, cx - GAP, cy, fill=COLOR, width=THICKNESS)
canvas.create_line(cx + GAP, cy, cx + GAP + LENGTH, cy, fill=COLOR, width=THICKNESS)
canvas.create_line(cx, cy - GAP - LENGTH, cx, cy - GAP, fill=COLOR, width=THICKNESS)
canvas.create_line(cx, cy + GAP, cx, cy + GAP + LENGTH, fill=COLOR, width=THICKNESS)

root.bind("<Escape>", lambda e: root.destroy())
root.mainloop()
```

From this simple script, I rebuilt and improved it into a full Electron app with a UI, multiple crosshair styles, color customization, presets, and hotkeys.

## Built by
Stark

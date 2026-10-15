# JsTetris

A small Tetris game written in plain JavaScript and drawn on an HTML canvas.

## ▶ [Play online](https://syu.github.io/JsTetris/FirstJs.html)

https://syu.github.io/JsTetris/FirstJs.html

## Controls

| Key | Action |
|---|---|
| ↑ | Rotate |
| ← / → | Move left / right |
| ↓ | Move down |
| Space | Drop |
| D / B / R | Default / Blue / Random colors |
| 1 – 5 | Block style: Simple, Dark, Light, Round, Alternative |

On touch screens, on-screen buttons appear under the board. Colors and block styles can also be picked by clicking them in the side panel.

## Speed

The game speeds up every 5 cleared lines, from speed 1 (1 row per second) up to speed 10 (about 10 rows per second).

## Run locally

No build step is needed: clone the repo and open `FirstJs.html` in a browser.

You can also serve the folder with a local web server:

```bash
python -m http.server 8123
```

Then open http://localhost:8123/FirstJs.html

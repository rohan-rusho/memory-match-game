# Memory Match Game 🧠🃏

Flip the cards and find all 8 matching pairs on a 4×4 grid.

## Features

- 4×4 card grid with 8 emoji pairs, reshuffled every game
- Flip/match logic — matching pairs stay face up, misses flip back
- Move counter, live timer (starts on your first flip), and pairs-found tracker
- Win state with your final moves and time, plus a Play again button
- Restart button to reshuffle at any time

## Run locally

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

No build step, no dependencies except Google Fonts. Just open `index.html` or serve the folder.

## Deploy

Any static host works — GitHub Pages, Netlify, Vercel: publish this folder as-is.

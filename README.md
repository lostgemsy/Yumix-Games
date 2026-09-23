# Yumix Games

A clean white-theme games site made for Vercel. No games are included, you add your own.

## Folder layout
```
index.html            home page (sliding credits + Message the Owner button)
games.html            game library with search
game.html             plays a game (?g=folder)
games.js              <-- the list of your games
sendMSGtoowner.html   visitors send messages to you
viewersMsg.html       YOUR inbox (password protected)
Games/                one folder per game (each needs an index.html)
images/               the logo png/jpg of each game
assets/               style.css, backgrounds/, logos/, slider/
api/                  Vercel serverless functions for the messages
```

## Add a game
1. Copy the game's folder into `Games/` (example: `Games/slope/index.html`).
2. Put its logo in `images/` (example: `images/slope.png`).
3. Add a line in `games.js`:
   `{ name: 'Slope', folder: 'slope', image: 'slope.png' },`

Folder and file names are case-sensitive on Vercel: `Slope` and `slope` are different.

## Add the sliding credit images (home page)
Put the pngs in `assets/slider/`, then list them in the `SLIDES` array at the bottom of `index.html`:
`'helper1.png'` or `{src:'helper2.png', name:'Alex'}`. It loops forever on its own.

## Run it locally
Only the messages need a server, so use Vercel's dev server:
```
npm i -g vercel
vercel dev
```
Or, to just look at the pages: `npx serve .` (messages won't work in this mode).

## Deploy to Vercel
1. Push this folder to a GitHub repo.
2. On vercel.com choose **Add New > Project**, import the repo, and click Deploy (no build settings needed).
3. Set up the message inbox (once):
   - In your Vercel project open **Storage** (or the Marketplace) and add **Upstash Redis** (free plan is fine). This adds the database variables automatically.
   - Open **Settings > Environment Variables** and add `OWNER_PASSWORD` with a password only you know.
   - **Redeploy** so the new variables load.
4. Visit `yourdomain.com/viewersMsg.html`, enter your password, and read your messages. You can delete one or clear all.

## Notes
- Visitors send from `sendMSGtoowner.html`. Messages are capped at 500 characters and the newest 500 are kept.
- Game files can be big. If Vercel complains about size, host the biggest games somewhere else and point to them.
- Change the colors in `assets/style.css` (the `--acc` variable is the purple accent).

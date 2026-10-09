# Mahalaya — Bengali Letterpress Experience

**Design & Development by Subham**

This is the readable, organised source-code edition of the working Mahalaya website. The design, book interaction, touch controls, scrolling effects and vintage radio have been preserved from the approved version.

## Project structure

```text
Mahalaya_Studio_By_Subham/
├── index.html                         Main website
├── assets/
│   ├── css/
│   │   └── styles.css                 Colour palette, layout and animations
│   ├── js/
│   │   └── main.js                    Scroll effects, radio and page turns
│   └── audio/
│       └── chandi-path.mp3            Uploaded 35-second recording
├── google-sites/
│   ├── MAHALAYA_EMBED_COPY_PASTE.txt  Paste this into Google Sites
│   └── MAHALAYA_SINGLE_FILE.html      Standalone all-in-one website
└── README.md
```

## Open the website on your computer

Extract the ZIP, open `index.html` in a modern web browser, and use the round switch to play the radio. You can also upload the whole folder to an ordinary website host (keep the folder structure unchanged).

## Google Sites — no coding required

1. Open `google-sites/MAHALAYA_EMBED_COPY_PASTE.txt`.
2. Select all text, then copy it.
3. Edit your Google Site and choose **Insert → Embed → Embed code**.
4. Paste everything and choose **Next → Insert**.
5. Make the inserted frame full width and approximately 800–900 pixels tall. Publish and check on mobile.

**Important:** Google Sites cannot load `assets/css/styles.css`, `assets/js/main.js` or `assets/audio/chandi-path.mp3` from a folder on your own computer when you paste an HTML snippet. Use the supplied single-file Google Sites code rather than pasting `index.html` by itself.

## Where to make changes

- **Text and sections:** `index.html`
- **Colours, typography and animations:** `assets/css/styles.css`
- **Scroll, radio, swipe and book controls:** `assets/js/main.js`
- **Radio audio:** Replace `assets/audio/chandi-path.mp3` with another MP3 that you have permission to use. The Google Sites single-file version must be regenerated after changing audio.

## Playback and device notes

The built-in recording runs for approximately **35 seconds**, and the radio starts only when the visitor taps its power switch (browser autoplay rules). Physical haptic vibration works only on browsers/devices that support it; visible tactile feedback works elsewhere.

No online fonts, images, script libraries or streaming platforms are required.

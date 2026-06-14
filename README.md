PlantUML Live Preview

A minimal static web app that previews PlantUML diagrams using the public PlantUML server.

How to run locally

Using Python 3:

```bash
python -m http.server 8000
```

Open http://localhost:8000/ in your browser.

Or use Node (serve):

```bash
npx serve
```

Files

- index.html — UI and includes `app.js` and `style.css`
- app.js — preview logic using `plantuml-encoder`
- style.css — simple layout styles

Notes

- This uses the public PlantUML server (https://www.plantuml.com). For private or heavy use, run your own PlantUML server.
- If you want a Node-based preview server, I can scaffold that next.
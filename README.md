# BLACKBOX // EiDOS — Public V1

A static release hub and interactive field guide for the METALHEART roleplay preset, created for Ángel / [@angyaruo](https://github.com/angyaruo).

Public V1 packages the creator-supplied internal build V4.4.3. The JSON download is byte-for-byte identical to that export, including its name and saved settings. The site does not call a model provider.

## Preview

Install Node.js, then run `npm start` from this directory. Open the printed localhost URL (default port 4390). No package installation is required. Run `npm run check` for release integrity, assets, paths, source-derived settings, and component checks.

`dist/` is the entire deployable site. Serve it over HTTP; opening `index.html` with `file://` will prevent the JSON-backed demos and guide from loading in some browsers.

## Contents

- `dist/index.html`, `styles.css`, `app.js`: responsive website, accessible tabs, module filters, copyable starter checklists, motion preference, and light/dark demo skins.
- `dist/assets/metalheart.css`: display CSS extracted from the supplied preset, not a substitute visual skin.
- `dist/demos.json`: prepared, noncanonical scene fixtures processed through the export's display rules. No live AI output or user chat history.
- `dist/release.json`: public/internal version mapping, exact download checksum, and a curated guide whose control defaults are read from the export.
- `dist/downloads/`: original release export.
- `scripts/prepare.mjs`: regenerates release data, demo markup, and display CSS from an explicitly supplied current export. It does not modify that input.

## GitHub Pages

This repository is initially private. Review the local site before enabling public hosting. Repository visibility must be changed deliberately by its owner if needed; GitHub Free supports Pages from public repositories, while eligible paid plans also support private source repositories. A normal Pages site is public even when its source repository is private.

When ready, open repository **Settings → Pages** and choose **GitHub Actions** as the build/deployment source. Run the `Deploy BlackBox website` workflow from Actions. It validates the checked-in release and uploads only `dist/`, then deploys to Pages. Publication is manual; subsequent pushes do not automatically release the site.

The expected project address, after a successful deployment, is `https://angyaruo.github.io/BlackBox-Preset/`. This address is not a claim that deployment has happened. All local assets use relative paths for that project subdirectory. No custom domain is required.

## Updating the release

1. Review the new source export and update the version/file labels in `scripts/prepare.mjs` and the page when changing release versions.
2. Run `node scripts/prepare.mjs "<path to the reviewed Lumiverse export>"`.
3. Review the generated module notes against any changed controls. Keep factual compatibility limits current.
4. Run `npm run check`, preview the page at desktop and narrow widths, and inspect all four specimen tabs.
5. Commit the reviewed files and run the manual deployment workflow when ready.

The supplied artwork is included locally so the page does not depend on third-party image hosts. No analytics, cookies, remote fonts, or API key forms are used. The browser may store the visitor's motion preference in local storage.

## Attribution and scope

BLACKBOX, EiDOS, Kazz, and the supplied visual assets belong to the creator's project. Preserve attribution when sharing substantial preset text, as requested in the included preset guide. No new software or artwork license is granted by this website; agree separate licensing terms before redistributing assets beyond their existing permissions.

The preset is a Lumiverse export. A separately tested SillyTavern conversion, external memory database, dice service, and provider access are not included. Starter configurations are checklists, not additional exported presets.

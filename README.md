# BLACKBOX // EiDOS — V1.2.1

A static release hub and interactive field guide for the METALHEART roleplay preset, created for Ángel / [@angyaruo](https://github.com/angyaruo).

The official release is V1.2.1 (`presetVersion: "1.2.1"`). Its SHA-256 is pinned in `dist/release-contract.js`; preparation copies those exact reviewed bytes. The guide and interview use the current 108-block structure, exclusive length mode, fixed character checks and grouped Presentation controls. The site does not call a model provider.

The setup interview also creates a separately named **Custom** copy in the visitor’s browser. It does not replace the original download. Seven steps cover participation, reading preferences, prose, persona, visuals, commentary, and visible planning; a review shows saved choices, mode precedence, and a diff against the original export. Unlisted controls remain unchanged. Answers are held only in tab memory and are lost on reload.

## Preview

Install Node.js, then run `npm start` from this directory. Open the printed localhost URL (default port 4390). No package installation is required. Run `npm run check` for release integrity, assets, paths, source-derived settings, and component checks.

`dist/` is the entire deployable site. Serve it over HTTP; opening `index.html` with `file://` will prevent the JSON-backed demos and guide from loading in some browsers.

## Contents

- `dist/index.html`, `styles.css`, `app.js`: responsive website, accessible tabs, module filters, copyable starter checklists, motion preference, and light/dark demo skins.
- `dist/assets/metalheart.css`: display CSS extracted from the supplied preset, not a substitute visual skin.
- `dist/demos.json`: prepared, noncanonical scene fixtures processed through the export's display rules. No live AI output or user chat history.
- `dist/release.json`: public and preset version metadata, exact download checksum, and a curated guide whose control defaults are read from the export.
- `dist/configurator-core.js`: explicit answer-to-control mappings, validation, precedence explanations, and a pure export transformer.
- `dist/configurator.js`: accessible interview, release-checksum verification, custom JSON download, and an optional plain-text settings receipt.
- `scripts/guide-data.mjs`: twelve plain-language category explanations covering every block. Membership is checked against the reviewed release structure.
- `scripts/check-configurator.mjs`: validates all offered options and mode combinations, saved/default agreement, skin pairing, rejection paths, and preservation of everything outside the allowed settings.
- `dist/downloads/BLACKBOX-V1.2.1.json`: official release export. The earlier preview-build file is retained only for existing links.
- `scripts/prepare.mjs`: regenerates release data, demo markup, and display CSS from an explicitly supplied current export. It does not modify that input.

## GitHub Pages

The site is hosted with GitHub Pages. Repository visibility must be changed deliberately by its owner if needed; GitHub Free supports Pages from public repositories, while eligible paid plans also support private source repositories. A normal Pages site is public even when its source repository is private.

When ready, open repository **Settings → Pages** and choose **GitHub Actions** as the build/deployment source. Run the `Deploy BlackBox website` workflow from Actions. It validates the checked-in release and uploads only `dist/`, then deploys to Pages. Publication is manual; subsequent pushes do not automatically release the site.

The project address is `https://angyaruo.github.io/BlackBox-Preset/`. Changes appear there only after a successful deployment. All local assets use relative paths for that project subdirectory. No custom domain is required.

## Updating the release

1. Review the new source export and update the version/file labels in `scripts/prepare.mjs` and the page when changing release versions.
2. Run `node scripts/prepare.mjs "<path to the reviewed Lumiverse export>"`.
3. Review the category map, module notes, and configurator mappings against any changed controls. The configurator is pinned to the reviewed release and will reject an unsupported release. Keep factual compatibility limits current.
4. Run `npm run check`, preview the page at desktop and narrow widths, and inspect all four specimen tabs.
5. Commit the reviewed files and run the manual deployment workflow when ready.

The supplied artwork is included locally so the page does not depend on third-party image hosts. No analytics, cookies, remote fonts, or API key forms are used. The browser may store the visitor's motion preference in local storage.

## Attribution and scope

BLACKBOX, EiDOS, Kazz, and the supplied visual assets belong to the creator's project. Preserve attribution when sharing substantial preset text, as requested in the included preset guide. No new software or artwork license is granted by this website; agree separate licensing terms before redistributing assets beyond their existing permissions.

The preset is a Lumiverse export. A separately tested SillyTavern conversion, external memory database, dice service, and provider access are not included. Starter configurations remain manual checklists; the interview generates actual custom JSON files. Existing chat-level settings in Lumiverse may override imported choices. A file-level validation is not a real frontend import or a guarantee of model behavior.

## Custom-export contract

The browser verifies the original download against `release.json` before enabling export. It deep-copies the preset, synchronizes the mapped variable defaults and `promptVariables` values (selects store option IDs), changes only selected optional block states and OG-dark/OG-light/LITE renderer flags, and gives the copy a distinct name. Prompt text, block IDs and order, regex patterns and replacements, provider settings, and all unrelated fields are preserved. Shared rules stay enabled as supplied. No instruction text is generated or executed by the configurator.

Strict Discovery and other controlling modes can suppress saved choices. The review explains these interactions; the receipt records both the requested answers and the changed saved controls. Mature-content modules are off in the interview’s starting suggestions; a visitor can explicitly retain the original release’s content selections. This is a prompt preference, not an enforced content filter. The original release is never rewritten.

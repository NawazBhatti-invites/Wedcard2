# Fonts

| Use | Font | File |
|---|---|---|
| Cover, welcome and save-the-date wording | **Tempting** | `Tempting.otf` (included) |
| Groom's name only | **Birds of Paradise** | `BirdsOfParadise.ttf` (included) |
| The words **Rasm-e-Hina, Barat, Walima** only | **Romantic** (Graphix Line Studio) | `Romantic.otf` (included) |
| Invitation wording page | **Astoria** (Khurasan) | `Astoria.otf` (included) |
| Dates, times, addresses, countdowns; the Locations page; the RSVP page and form | **Poppins** | `Poppins-Regular.ttf`, `Poppins-Medium.ttf` (included) |
| Bismillah (Arabic) | **Aref Ruqaa**, with **Amiri** as backup | loaded from Google Fonts in `index.html` |

`css/style.css` loads the local files with `@font-face`. Only these files are used, so a different font installed on a guest's phone is never substituted. If a file is ever missing, the site falls back to Parisienne (Google Fonts) and keeps working.

To host the Arabic fonts yourself, download Aref Ruqaa and Amiri from fonts.google.com and add `@font-face` rules for them.

## Licences

- **Poppins, Aref Ruqaa, Amiri**: SIL Open Font License, so web use is allowed. Keep the licence text with the fonts if you publish the repository.
- **Tempting, Birds of Paradise, Astoria**: the download names and the DaFont listings say "personal use only".
- **Romantic (Graphix Line Studio)**: I could not confirm its licence.

Anyone can download font files from a public website, which a personal-use licence may not allow. This is your decision to make; if you prefer, ask the authors for permission, buy a web licence, or keep the repository private.

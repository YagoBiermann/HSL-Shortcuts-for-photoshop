# HSL Color Shortcuts for Photoshop

**Adjust your brush color without taking your eyes off the canvas.**

This HSL Color Shortcuts pack was designed especially for people who paint digitally, illustrate, or retouch images and need small color variations all the time.

Changing saturation, lightness, and hue during the digital painting process can be a repetitive and tiring task for many artists. With that in mind, I created this pack of scripts that automate the job.

---

## What's in the pack

| Script | What it does | Default step |
|---|---|---|
| `Cor - More_Saturation.jsx` | Increase color saturation | +5% |
| `Cor - Less_Saturation.jsx` | Increase color saturation | −5% |
| `Cor - More_Brightness.jsx` | Lightens the color (toward white) | +5% |
| `Cor - Less_Brightness.jsx` | Darkens the color (toward black) | −5% |
| `Cor - Matiz_forward.jsx` | Moves clock-wise on the color wheel (red → yellow → green → blue…) | +10° |
| `Cor - Matiz_backward.jsx` | Moves backward around the color wheel | −10° |

## Highlights

- **Fast:** one shortcut, one change. Hold the key down for bigger adjustments.
- **Precise:** each script changes only one thing. Hue changes without affecting saturation and lightness, and vice versa.
- **Never loses the color:** if you push the color all the way to gray, black, or white and then come back, the original hue comes back with it.
- **No accumulated drift:** values are stored precisely between presses, so going back and forth many times won't "muddy" the color.
- **Customizable:** you choose the step size for each script.
- **Lightweight:** these are simple scripts. No plugins, panels, or anything extra to install.

---

## Requirements

- Adobe Photoshop (recent Creative Cloud versions)
- Windows or macOS

## Installation

### 1. Copy the scripts to the Photoshop folder

Copy the 6 `.jsx` files to the **Presets › Scripts** folder of your Photoshop installation:

- **Windows:** `C:\Program Files\Adobe\Adobe Photoshop <version>\Presets\Scripts`
- **macOS:** `/Applications/Adobe Photoshop <version>/Presets/Scripts`

Replace `<version>` with the one you have installed, for example `Adobe Photoshop 2025`.

> On Windows, the system may ask for administrator permission to copy files to this folder. That's normal, just confirm.

### 2. Restart Photoshop

Close and reopen Photoshop. The scripts will appear under **File › Scripts**.

### 3. Create the keyboard shortcuts

1. Open **Edit › Keyboard Shortcuts**.
2. Under **Shortcuts For**, choose **Application Menus**.
3. Expand **File** and scroll down to **Scripts**.
4. Click a script, for example *Cor - Mais Saturacao*, and press the key combination you want to use.
5. Repeat for the other scripts and click **OK**.

> **Watch out for conflicts:** Photoshop uses a lot of key combinations, including many with Ctrl and Ctrl+Alt (Cmd and Cmd+Option on Mac). If the combination you pick is already in use, the shortcuts window shows a **warning**. If you confirm anyway, the old function loses its shortcut. Especially avoid Ctrl+S (Save) and Ctrl+W (Close). Try a few combinations and keep one that doesn't show a warning.

#### Suggested layout

Grouping the shortcuts on neighboring keys makes them easier to remember:

| Action | Suggested key |
|---|---|
| Hue − / Hue + | Q / E |
| Lightness + / − | W / S |
| Saturation − / + | A / D |

Use these letters together with a modifier that's free in your Photoshop.

---

## How to use

1. Pick a foreground color as you normally would: eyedropper, color picker, or swatches.
2. Press the shortcuts to adjust it. The color swatch in the toolbar updates instantly.
3. Keep painting with the new color.

**Practical examples**

- *Shadow:* darken with Lightness − and nudge the hue a little toward blue/purple with Hue + or −.
- *Light:* lighten with Lightness + and nudge the hue toward yellow.
- *Skin, foliage, or fabric variation:* give Hue and Saturation one or two taps to create tones similar to the base color.

**Good to know**

- If the color is fully gray, black, or white, changing the hue won't show on screen, because there's no saturation to display it. The script still keeps track of the hue, and it will appear once you increase the saturation.
- Changing the foreground color doesn't create steps in the History panel.

---

## Customization

Each script has two settings at the top of the file. Open the `.jsx` in a plain text editor (Notepad, TextEdit in plain text mode, VS Code…):

```javascript
var CANAL = "s";   // channel: "h" = hue (color), "s" = saturation, "l" = lightness
var PASSO = 5;     // step: adjustment size per press. Negative decreases.
```

- **PASSO (step):** how much each press changes.
  - Saturation and lightness: in percentage points, from 0 to 100. Use `2` for fine adjustments and `10` for large ones.
  - Hue: in degrees, from 0 to 360. `10` gives 36 steps to go all the way around the color wheel.
- **CANAL (channel):** which property the script changes. You normally don't need to change this.

Save the file. The change takes effect the next time the script runs, no need to restart Photoshop.

> Want more than one step size, for example a fine and a coarse adjustment? Duplicate the file, give it a different name (like `Cor - Mais Saturacao (fino).jsx`), change `PASSO`, and assign it a different shortcut.

---

## How it works

The scripts work in the **HSL** color model:

- **H (hue):** the "color" itself, a position on the color wheel.
- **S (saturation):** the intensity. 0% is gray, 100% is the pure color.
- **L (lightness):** from 0% (black) to 100% (white), with the pure color at 50%.

Photoshop's color picker uses **HSB** (brightness), which is similar but not the same. That's why the numbers you see in the picker may not exactly match the scripts' steps. This is expected.

---

## Troubleshooting

**The scripts don't appear under File › Scripts**
Make sure the files are in the `Presets\Scripts` folder of the **same version** of Photoshop you're using and that they end in `.jsx`. Then restart Photoshop.

**The shortcut does nothing or does something else**
Another function may be using the same combination. Go back to *Edit › Keyboard Shortcuts* and choose a combination with no conflict warning.

**An error message appears**
Write down the error number and the line shown in the message. This helps track down the problem.

**I want to uninstall**
Delete the `.jsx` files from the `Presets\Scripts` folder and restart Photoshop.

---

*Version 1.0*

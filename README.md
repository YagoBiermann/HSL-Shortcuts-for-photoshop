# HSL Color Shortcuts for Photoshop

**Adjust your brush color without taking your brush cursor off the canvas.**

This HSL Color Shortcuts pack was designed especially for people who paint digitally, illustrate, or retouch images and need small color variations all the time.

Changing hue, saturation, and lightness during the digital painting process can be a repetitive and tiring task for many artists. With that in mind, I created this pack of scripts that automate the job.

---
## Practical examples
Shadows, light, and tone variations, using only the shortcuts.

https://github.com/user-attachments/assets/53bad512-ea02-42f3-94d9-e846296b1506

## What's in the pack

| Script | What it does | Default step |
|---|---|---|
| `Hue - Increase.jsx` | Moves forward on the color wheel (red → yellow → green → blue…) | +5° |
| `Hue - Decrease.jsx` | Moves backward around the color wheel | −5° |
| `Saturation - Increase.jsx` | Increases color saturation | +5% |
| `Saturation - Decrease.jsx` | Decreases color saturation | −5% |
| `Lightness - Increase.jsx` | Lightens the color (toward white) | +5% |
| `Lightness - Decrease.jsx` | Darkens the color (toward black) | −5% |

## Highlights

- **Fast:** one shortcut, one change.
- **Precise:** each script changes only one thing. Hue changes without affecting saturation and lightness, and vice versa.
- **Never loses the color:** if you push the color all the way to gray, black, or white and then come back, the original hue and saturation come back with it, as long as Photoshop stays open.
- **No accumulated drift:** values are stored precisely between presses, and the color is rounded only when it is applied, so going back and forth many times won't "muddy" the color.
- **Safe:** the scripts only change the foreground color. They never touch your pixels, layers, selections, or document.
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
4. Click a script, for example *Saturation - Increase*, and press the key combination you want to use.
5. Repeat for the other scripts and click **OK**.

#### Suggested layout

Grouping the shortcuts on neighboring keys makes them easier to remember:

| Action | Suggested key |
|---|---|
| Hue Decrease / Hue Increase | Q / E |
| Lightness Increase / Lightness Decrease | W / S |
| Saturation Decrease / Saturation Increase | A / D |

## How to use

1. Pick a foreground color as you normally would: eyedropper, color picker, or swatches.
2. Press the shortcuts to adjust it. The color swatch in the toolbar updates instantly.
3. Keep painting with the new color.

---

## Customization

Each script has **one setting** at the top of the file. Open the `.jsx` in a plain text editor (Notepad, TextEdit in plain text mode, VS Code…):

```javascript
var HUE_STEP = 5;          // in Hue scripts: degrees per press
var SATURATION_STEP = 5;   // in Saturation scripts: percentage points per press
var LIGHTNESS_STEP = 5;    // in Lightness scripts: percentage points per press
```

Each file contains only the line for its own channel.

- **Step size:** how much each press changes.
  - Saturation and lightness: in percentage points, from 0 to 100. Use `2` for fine adjustments and `10` for large ones.
  - Hue: in degrees, from 0 to 360. `5` gives 72 steps to go all the way around the color wheel, and `10` gives 36.
- **Direction:** each script has its own fixed direction (the file name tells you which). Always enter a positive number, or `0` for no change. Don't use negative numbers.
- **Increase and Decrease are separate files:** if you want a different step, change it in both.

Save the file. The change takes effect the next time the script runs, no need to restart Photoshop.

If the value isn't a valid number, the script shows an error message and leaves your color untouched.

> Want more than one step size, for example a fine and a coarse adjustment? Duplicate the file, give it a different name (like `Saturation - Increase (fine).jsx`), change the step, and assign it a different shortcut.

---

## How it works

The scripts work in the **HSL** color model:

- **H (hue):** the "color" itself, a position on the color wheel. It wraps around: going past 360° brings you back to 0°.
- **S (saturation):** the intensity. 0% is gray, 100% is the pure color.
- **L (lightness):** from 0% (black) to 100% (white), with the pure color at 50%.

Photoshop's color picker uses **HSB** (brightness), which is similar but not the same. That's why the numbers you see in the picker may not exactly match the scripts' steps. This is expected.

### Remembering the color

Photoshop only stores the foreground color as RGB, so gray, black, and white don't carry any hue. To get around that, all six scripts share one small memory: the last color they produced, together with its exact hue, saturation, and lightness. On each press:

- If the foreground color is still the one the scripts produced, they continue from the remembered values. This is what brings the hue back after a trip through gray.
- If it's different, you picked something else, and they start from that color.

---

## Troubleshooting

**The scripts don't appear under File › Scripts**
Make sure the files are in the `Presets\Scripts` folder of the **same version** of Photoshop you're using and that they end in `.jsx`. Then restart Photoshop.

**The shortcut does nothing or does something else**
Another function may be using the same combination. Go back to *Edit › Keyboard Shortcuts* and choose a combination with no conflict warning.

**An error message appears**
During normal use the scripts show nothing. A message appears only when something goes wrong, for example an invalid step value in the file. Read the message, since it says what failed, and fix the setting if it points to one.

**A message says the color was updated but the state could not be saved**
The new color was applied correctly. Only the memory of its hue and saturation failed, so the next press may not recover a hue from gray. Picking the color again or pressing once more normally fixes it.

**I want to uninstall**
Delete the `.jsx` files from the `Presets\Scripts` folder and restart Photoshop.

---

*Version 1.0*

#target photoshop

/*
 * Hue - Decrease.jsx
 *
 * Rotates the hue of the Foreground Color backward by HUE_STEP degrees.
 */

(function () {

    // =====================================================================
    // Configuration
    // =====================================================================

    // Hue change per run, in degrees. Must be a finite number >= 0.
    // Values above 360 are allowed and wrap around the color wheel.
    var HUE_STEP = 5;

    // Fixed by this script. Do not edit.
    var DIRECTION = -1;
    var OPERATION_LABEL = "decrease hue";

    // Constants shared by all six scripts. Keep identical across files.
    var DIALOG_TITLE = "HSL Shortcuts";
    var HUE_MIN = 0;
    var HUE_MAX = 360; // Exclusive: 360 degrees wraps to 0.
    var HUE_SECTOR_SIZE = 60; // Degrees per sector of the color wheel.
    var PERCENT_MIN = 0;
    var PERCENT_MAX = 100;
    var RGB_MIN = 0;
    var RGB_MAX = 255;
    var STATE_KEY = "com.hslshortcuts.foregroundColorState";
    var STATE_VERSION = 1;
    var STATE_FIELD_IDS = {
        version: "hslShortcutsStateVersion",
        red: "hslShortcutsStateRed",
        green: "hslShortcutsStateGreen",
        blue: "hslShortcutsStateBlue",
        hue: "hslShortcutsStateHue",
        saturation: "hslShortcutsStateSaturation",
        lightness: "hslShortcutsStateLightness"
    };

    function validateConfiguration() {
        validateStep("HUE_STEP", HUE_STEP);
    }

    // =====================================================================
    // Main execution
    // =====================================================================

    function main() {
        var appliedRgb;
        var newHsl;

        try {
            validateConfiguration();
            var currentRgb = readForegroundRgb();
            var currentHsl = resolveCurrentHsl(currentRgb, loadColorState());
            newHsl = applyOperation(currentHsl);
            appliedRgb = applyForegroundRgb(hslToRgb(newHsl));
        } catch (error) {
            reportFailure("Unable to " + OPERATION_LABEL + ": " + describeError(error));
            return;
        }

        // The state is saved only after Photoshop has confirmed the new color.
        try {
            saveColorState(appliedRgb, newHsl);
        } catch (stateError) {
            reportFailure(
                "The foreground color was updated, but its HSL state could not be saved. " +
                "The next run may not preserve hue or saturation: " + describeError(stateError)
            );
        }
    }

    function reportFailure(message) {
        alert(message, DIALOG_TITLE, true);
    }

    function describeError(error) {
        return (error && error.message) ? error.message : String(error);
    }

    // =====================================================================
    // Color manipulation
    // =====================================================================

    function applyOperation(hsl) {
        return {
            hue: normalizeHue(hsl.hue + DIRECTION * HUE_STEP),
            saturation: hsl.saturation,
            lightness: hsl.lightness
        };
    }

    // The stored HSL is reused only while the Foreground Color still has the
    // RGB that the state was saved with. Otherwise the user picked a new color.
    function resolveCurrentHsl(currentRgb, storedState) {
        if (storedState !== null && rgbEquals(currentRgb, storedState)) {
            return {
                hue: storedState.hue,
                saturation: storedState.saturation,
                lightness: storedState.lightness
            };
        }
        return rgbToHsl(currentRgb);
    }

    function readForegroundRgb() {
        var rgb;
        try {
            var color = app.foregroundColor.rgb;
            rgb = {
                red: Math.round(color.red),
                green: Math.round(color.green),
                blue: Math.round(color.blue)
            };
        } catch (error) {
            throw new Error("Unable to read the foreground color: " + describeError(error));
        }
        if (!isValidRgb(rgb)) {
            throw new Error("The foreground color is not a valid RGB color.");
        }
        return rgb;
    }

    // Sets the Foreground Color
    function applyForegroundRgb(rgb) {
        var target = roundRgb(rgb);
        try {
            var color = new SolidColor();
            color.rgb.red = target.red;
            color.rgb.green = target.green;
            color.rgb.blue = target.blue;
            app.foregroundColor = color;
        } catch (error) {
            throw new Error("Unable to apply the new foreground color: " + describeError(error));
        }

        var applied = readForegroundRgb();
        if (!rgbEquals(applied, target)) {
            throw new Error(
                "Photoshop did not keep the requested foreground color. Expected " +
                formatRgb(target) + ", found " + formatRgb(applied) + "."
            );
        }
        return applied;
    }

    // =====================================================================
    // RGB / HSL conversion
    // Hue is in degrees [0, 360). Saturation and lightness are percentages.
    // =====================================================================

    function rgbToHsl(rgb) {
        if (!isValidRgb(rgb)) {
            throw new Error("rgbToHsl received an invalid RGB color.");
        }

        var red = rgb.red / RGB_MAX;
        var green = rgb.green / RGB_MAX;
        var blue = rgb.blue / RGB_MAX;
        var max = Math.max(red, green, blue);
        var min = Math.min(red, green, blue);
        var delta = max - min;
        var lightness = (max + min) / 2;
        var hue = 0;
        var saturation = 0;

        if (delta > 0) {
            saturation = (lightness > 0.5) ? delta / (2 - max - min) : delta / (max + min);

            if (max === red) {
                hue = (green - blue) / delta;
            } else if (max === green) {
                hue = (blue - red) / delta + 2;
            } else {
                hue = (red - green) / delta + 4;
            }
            hue = hue * HUE_SECTOR_SIZE;
        }

        return {
            hue: normalizeHue(hue),
            saturation: clamp(saturation * PERCENT_MAX, PERCENT_MIN, PERCENT_MAX),
            lightness: clamp(lightness * PERCENT_MAX, PERCENT_MIN, PERCENT_MAX)
        };
    }

    function hslToRgb(hsl) {
        if (!isValidHsl(hsl)) {
            throw new Error("hslToRgb received an invalid HSL color.");
        }

        var saturation = hsl.saturation / PERCENT_MAX;
        var lightness = hsl.lightness / PERCENT_MAX;
        var chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
        var huePrime = hsl.hue / HUE_SECTOR_SIZE;
        var secondary = chroma * (1 - Math.abs((huePrime % 2) - 1));
        var offset = lightness - chroma / 2;
        var red;
        var green;
        var blue;

        if (huePrime < 1) {
            red = chroma; green = secondary; blue = 0;
        } else if (huePrime < 2) {
            red = secondary; green = chroma; blue = 0;
        } else if (huePrime < 3) {
            red = 0; green = chroma; blue = secondary;
        } else if (huePrime < 4) {
            red = 0; green = secondary; blue = chroma;
        } else if (huePrime < 5) {
            red = secondary; green = 0; blue = chroma;
        } else {
            red = chroma; green = 0; blue = secondary;
        }

        return {
            red: clamp((red + offset) * RGB_MAX, RGB_MIN, RGB_MAX),
            green: clamp((green + offset) * RGB_MAX, RGB_MIN, RGB_MAX),
            blue: clamp((blue + offset) * RGB_MAX, RGB_MIN, RGB_MAX)
        };
    }

    function roundRgb(rgb) {
        return {
            red: clamp(Math.round(rgb.red), RGB_MIN, RGB_MAX),
            green: clamp(Math.round(rgb.green), RGB_MIN, RGB_MAX),
            blue: clamp(Math.round(rgb.blue), RGB_MIN, RGB_MAX)
        };
    }

    // =====================================================================
    // Validation and normalization
    // =====================================================================

    function validateStep(stepName, stepValue) {
        if (!isFiniteNumber(stepValue) || stepValue < 0) {
            throw new Error(
                stepName + " must be a finite number greater than or equal to 0 (current value: " +
                stepValue + ")."
            );
        }
    }

    function normalizeHue(hue) {
        if (!isFiniteNumber(hue)) {
            throw new Error("Hue must be a finite number.");
        }
        return ((hue % HUE_MAX) + HUE_MAX) % HUE_MAX;
    }

    function clamp(value, min, max) {
        if (!isFiniteNumber(value)) {
            throw new Error("Cannot clamp a value that is not a finite number.");
        }
        return Math.min(Math.max(value, min), max);
    }

    function isFiniteNumber(value) {
        return typeof value === "number" && isFinite(value);
    }

    function isObject(value) {
        return value !== null && typeof value === "object";
    }

    function isNumberInRange(value, min, max) {
        return isFiniteNumber(value) && value >= min && value <= max;
    }

    function isRgbChannel(value) {
        return isNumberInRange(value, RGB_MIN, RGB_MAX) && Math.floor(value) === value;
    }

    function isValidRgb(rgb) {
        return isObject(rgb) &&
            isRgbChannel(rgb.red) &&
            isRgbChannel(rgb.green) &&
            isRgbChannel(rgb.blue);
    }

    function isValidHsl(hsl) {
        return isObject(hsl) &&
            isNumberInRange(hsl.hue, HUE_MIN, HUE_MAX) && hsl.hue < HUE_MAX &&
            isNumberInRange(hsl.saturation, PERCENT_MIN, PERCENT_MAX) &&
            isNumberInRange(hsl.lightness, PERCENT_MIN, PERCENT_MAX);
    }

    function rgbEquals(first, second) {
        return first.red === second.red &&
            first.green === second.green &&
            first.blue === second.blue;
    }

    function formatRgb(rgb) {
        return "(" + rgb.red + ", " + rgb.green + ", " + rgb.blue + ")";
    }

    // =====================================================================
    // State persistence
    // One state object, stored under STATE_KEY and shared by all six scripts.
    // It holds the last applied RGB and the HSL that produced it. With
    // persistent = false it lasts for the current Photoshop session only.
    // =====================================================================

    function getStateTypeIds() {
        var ids = {};
        var name;
        for (name in STATE_FIELD_IDS) {
            if (STATE_FIELD_IDS.hasOwnProperty(name)) {
                ids[name] = stringIDToTypeID(STATE_FIELD_IDS[name]);
            }
        }
        return ids;
    }

    // Returns a valid state, or null when there is none or it is unusable.
    function loadColorState() {
        var descriptor;
        try {
            descriptor = app.getCustomOptions(STATE_KEY);
        } catch (error) {
            // Photoshop throws when nothing is stored under the key. That is the
            // normal situation on first use, not a failure.
            return null;
        }

        var state = readStateFromDescriptor(descriptor);
        return validateColorState(state) ? state : null;
    }

    function readStateFromDescriptor(descriptor) {
        var ids = getStateTypeIds();
        var name;
        for (name in ids) {
            if (ids.hasOwnProperty(name) && !descriptor.hasKey(ids[name])) {
                return null;
            }
        }

        try {
            return {
                version: descriptor.getInteger(ids.version),
                red: descriptor.getInteger(ids.red),
                green: descriptor.getInteger(ids.green),
                blue: descriptor.getInteger(ids.blue),
                hue: descriptor.getDouble(ids.hue),
                saturation: descriptor.getDouble(ids.saturation),
                lightness: descriptor.getDouble(ids.lightness)
            };
        } catch (error) {
            // A field with an unexpected type means the data is not ours: discard it.
            return null;
        }
    }

    // True only for a complete, current-version state whose HSL reproduces its RGB.
    function validateColorState(state) {
        if (!isObject(state) || state.version !== STATE_VERSION) {
            return false;
        }

        var rgb = { red: state.red, green: state.green, blue: state.blue };
        var hsl = { hue: state.hue, saturation: state.saturation, lightness: state.lightness };
        if (!isValidRgb(rgb) || !isValidHsl(hsl)) {
            return false;
        }

        return rgbEquals(roundRgb(hslToRgb(hsl)), rgb);
    }

    function saveColorState(rgb, hsl) {
        var state = {
            version: STATE_VERSION,
            red: rgb.red,
            green: rgb.green,
            blue: rgb.blue,
            hue: hsl.hue,
            saturation: hsl.saturation,
            lightness: hsl.lightness
        };
        if (!validateColorState(state)) {
            throw new Error("The color state to save is not valid.");
        }

        var ids = getStateTypeIds();
        var descriptor = new ActionDescriptor();
        descriptor.putInteger(ids.version, state.version);
        descriptor.putInteger(ids.red, state.red);
        descriptor.putInteger(ids.green, state.green);
        descriptor.putInteger(ids.blue, state.blue);
        descriptor.putDouble(ids.hue, state.hue);
        descriptor.putDouble(ids.saturation, state.saturation);
        descriptor.putDouble(ids.lightness, state.lightness);
        app.putCustomOptions(STATE_KEY, descriptor, false);
    }

    main();
})();

import { ProcessJson } from "./Process";

function getJson() {
    let proc_text = document.getElementById('proc').value;

    let bpm = document.getElementById("bpm").value;
    let muting = {};
    let patterns = {};
    let sliders = {};

    // Get all mute buttons and add them to muting dictionary
    let muteButtons = document.querySelectorAll('button[ismuted]')

    if (muteButtons != null) {
        muteButtons.forEach(muteButton => {
            muting[muteButton.id] = muteButton.getAttribute('ismuted');
        });
    }

    // Get all patterns and add them to patterns dictionary
    const PatternRegex = /<pattern>.+<\/pattern>/g;

    let patternsFound = proc_text.match(PatternRegex);

    if (patternsFound != null) {
        patternsFound.forEach(pattern => {
            let patternInfo = pattern.replace("<pattern>","").replace("</pattern>","").split(":");
            const patternName = patternInfo[0];
            const choices = patternInfo.slice(1);

            const patternChecked = document.querySelector(`input[name="${patternName + "Pattern"}"]:checked`);

            patterns[patternName + "Pattern"] = {
                "choices": choices,
                "value": patternChecked.value,
            }
        });
    }    

    // Get all sliders and add them to slider dictionary
    const SliderRegex = /<slider>.+<\/slider>/g;

    let slidersFound = proc_text.match(SliderRegex);

    if (slidersFound != null) {
        slidersFound.forEach(slider => {
            let sliderInfo = slider.replace("<slider>","").replace("</slider>","").split(":");
            const sliderName = sliderInfo[0];
            const attributes = sliderInfo.slice(1);

            const sliderObject = document.querySelector(`input[name="${sliderName + "Slider"}"]`);

            sliders[sliderName + "Slider"] = {
                "min": attributes[0],
                "max": attributes[1],
                "value": sliderObject.value,
            }
        });
    }
    
    let json = {
        "bpm": bpm,
        "muting": muting,
        "patterns": patterns,
        "sliders": sliders,
    }

    return json;
}

export function downloadJson() {
    const json = getJson();
    const jsonString = JSON.stringify(json, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    // Create temporary a tag to trigger download
    const a = document.createElement("a");
    a.href = url;
    a.download = "strudelsettings.json";
    document.body.appendChild(a);

    a.click();

    // Remove a tag and revoke url
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

export function loadJson(globalEditor) {
    const fileInput = document.getElementById("fileInput");

    if (fileInput.files.length == 0) {
        return;
    }

    const file = fileInput.files[0];

    const reader = new FileReader();

    reader.onload = (event) => {
        try {
            const jsonData = JSON.parse(event.target.result);
            ProcessJson(jsonData, globalEditor);
        } catch (error) {
            console.error(error);
        }
    };

    reader.readAsText(file);
} 
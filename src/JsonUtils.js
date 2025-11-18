function getJson() {
    let proc_text = document.getElementById('proc').value;

    let bpm = document.getElementById("bpm").value
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

            patterns[patternName] = {
                "choices": choices,
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

            sliders[sliderName] = {
                "min": attributes[0],
                "max": attributes[1],
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
    let json = getJson();
    console.log(json);
} 
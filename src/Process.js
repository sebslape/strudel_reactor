import React from "react";
import { createRoot } from "react-dom/client";
import Mute from "./components/Mute";
import Pattern from "./components/Pattern";
import Slider from "./components/Slider";

let mutingRoot = null;
let patternRoot = null;
let sliderRoot = null;

// Gets the processing text and adds controls
export function Proc(globalEditor) {
    let proc_text = document.getElementById('proc').value;
    
    proc_text = ProcessMuting(proc_text, globalEditor);
    proc_text = ProcessBPM(proc_text);
    proc_text = GetPatterns(proc_text, globalEditor);
    proc_text = GetSliders(proc_text, globalEditor);

    console.warn(proc_text);

    globalEditor.setCode(proc_text);
}

export function ProcAndPlay(globalEditor) {
    if (globalEditor != null && globalEditor.repl.state.started == true) {
        Proc(globalEditor);
        globalEditor.evaluate();
    } else if (globalEditor != null) {
        Proc(globalEditor);
    }
}

function ProcessMuting(proc_text, globalEditor) {
    let MutingSection = document.querySelector("*[title='Muting'] > div");
    const InstrumentRegex = /^\w+:/mg;

    let instruments = proc_text.match(InstrumentRegex);

    if (mutingRoot == null) {
        mutingRoot = createRoot(MutingSection);
    }

    if (instruments == null) {
        mutingRoot.render(null);
        return proc_text;
    }

    let muteArray = [];

    let instrumentNames = [];

    // Add the mute components to the muteArray
    instruments.forEach(instrument => {
        let instrumentName = instrument.trim().replace(":","");

        // Add the instrument name to the instrumentNames array
        instrumentNames.push(instrumentName);

        // Create the Mute object with the instrument name, globalEditor, and unique key
        muteArray.push(<Mute key={instrumentName} globalEditor={globalEditor} instrument={instrumentName} />);
    });

    mutingRoot.render(muteArray);

    instrumentNames.forEach(instrument => {
        const element = document.querySelector(`#${instrument}Mute`);
        if (element) {
            if (element.getAttribute("ismuted") == "true") {
                const instrumentRegex = new RegExp(`^${instrument}:`, "m");
                proc_text = proc_text.replace(instrumentRegex, "_" + instrument + ":");
            }
        }
    });

    return proc_text
}

function ProcessBPM(proc_text) {
    // Regex to locate setcps and setcpm
    const CPSRegex = /setcps\(.*\)/gi;
    const CPMRegex = /setcpm\(.*\)/gi;
    const BPMValue = document.getElementById('bpm').value;

    console.log()

    // Replace setcps with bpm input value
    let proc_text_replaced = proc_text.replace(CPSRegex, "setcps(" + BPMValue + ")");   

    // Replace setcpm with bpm input value
    proc_text_replaced = proc_text_replaced.replace(CPMRegex, "setcpm(" + BPMValue + ")");
    return proc_text_replaced;
}

function GetPatterns(proc_text, globalEditor) {
    const PatternsSection = document.querySelector("*[title='Patterns'] > div");
    const PatternRegex = /<pattern>.+<\/pattern>/g;

    let patterns = proc_text.match(PatternRegex);

    if (patternRoot == null) {
        patternRoot = createRoot(PatternsSection);
    }

    if (patterns == null) {
        patternRoot.render(null);
        return proc_text;
    }

    let patternArray = [];
    let patternNames = [];

    patterns.forEach(pattern => {
        let patternInfo = pattern.replace("<pattern>","").replace("</pattern>","").split(":");

        const patternName = patternInfo[0];
        const choices = patternInfo.slice(1);

        patternNames.push(patternName);

        patternArray.push(<Pattern key={patternName} patternName={patternName} choices={choices} globalEditor={globalEditor} />);
    });

    patternRoot.render(patternArray);

    patternNames.forEach(patternName => {
        const patternChecked = document.querySelector(`input[name="${patternName + "Pattern"}"]:checked`);

        // If the component is found, replace the pattern with the component's value
        // Otherwise, set it to a 0 as default
        if (patternChecked) {
            const specificPatternRegex = new RegExp(`<pattern>${patternName}.+</pattern>`, "g");
            proc_text = proc_text.replace(specificPatternRegex, patternChecked.value);
        } else {
            const specificPatternRegex = new RegExp(`<pattern>${patternName}.+</pattern>`, "g");
            proc_text = proc_text.replace(specificPatternRegex, 0);
        }
    });

    return proc_text;
}

function GetSliders(proc_text, globalEditor) {
    const SlidersSection = document.querySelector("*[title='Sliders'] > div");
    const SliderRegex = /<slider>.+<\/slider>/g;

    let sliders = proc_text.match(SliderRegex);

    if (sliderRoot == null) {
        sliderRoot = createRoot(SlidersSection);
    }

    if (sliders == null) {
        patternRoot.render(null);
        return proc_text;
    }

    let sliderArray = [];
    let sliderNames = [];

    sliders.forEach(slider => {
        let sliderInfo = slider.replace("<slider>","").replace("</slider>","").split(":");

        const sliderName = sliderInfo[0];
        const attributes = sliderInfo.slice(1);

        sliderNames.push(sliderName);

        sliderArray.push(<Slider key={sliderName} sliderName={sliderName} min={attributes[0]} max={attributes[1]} globalEditor={globalEditor} />);
    });

    sliderRoot.render(sliderArray);

    console.log(sliderNames);

    sliderNames.forEach(sliderName => {
        const slider = document.querySelector(`input[name="${sliderName + "Slider"}"]`);

        // If the component is found, replace the slider with the component's value
        // Otherwise, set it to a 0 as default
        if (slider) {
            const specificSliderRegex = new RegExp(`<slider>${sliderName}.+</slider>`, "g");
            proc_text = proc_text.replace(specificSliderRegex, slider.value);
        } else {
            const specificSliderRegex = new RegExp(`<slider>${sliderName}.+</slider>`, "g");
            proc_text = proc_text.replace(specificSliderRegex, 0);
        }
    });

    return proc_text;
}
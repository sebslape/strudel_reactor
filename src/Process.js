import React from "react";
import { createRoot } from "react-dom/client";
import Mute from "./components/Mute";
import Pattern from "./components/Pattern";

let mutingRoot = null;
let patternRoot = null;

export function Proc(globalEditor) {
    let MutingSection = document.querySelector("*[title='Muting'] > div");
    let proc_text = document.getElementById('proc').value;
    const InstrumentRegex = /\n\w+:/g;

    let instruments = proc_text.match(InstrumentRegex);

    if (mutingRoot == null) {
        mutingRoot = createRoot(MutingSection);
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
        const element = document.getElementById(instrument + "Off");
        if (element) {
            if (element.checked) {
                proc_text = proc_text.replace(instrument + ":", "_" + instrument + ":");
            }
        }
    });

    proc_text = ProcessBPM(proc_text);
    proc_text = GetPatterns(proc_text);

    console.warn(proc_text);

    globalEditor.setCode(proc_text);
}

export function ProcAndPlay(globalEditor) {
    if (globalEditor != null && globalEditor.repl.state.started == true) {
        Proc(globalEditor);
        globalEditor.evaluate();
    }
}

function ProcessBPM(proc_text) {
    // Regex to locate setcps
    const BPMRegex = /setcps\(.*\)/i;
    const BPMValue = document.getElementById('bpm').value;

    // Replace setcps with bpm input value
    let proc_text_replaced = proc_text.replace(BPMRegex, "setcps(" + BPMValue + ")");
    return proc_text_replaced;
}

function GetPatterns(proc_text, globalEditor) {
    const PatternsSection = document.querySelector("*[title='Patterns'] > div");
    const PatternRegex = /<pattern>.+<\/pattern>/g;

    let patterns = proc_text.match(PatternRegex);

    if (patterns == null) {
        return proc_text;
    }

    if (patternRoot == null) {
        patternRoot = createRoot(PatternsSection);
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
        const patternChecked = document.querySelector(`input[name="${patternName}"]:checked`);

        console.log(patternChecked.value);

        if (patternChecked) {
            const specificPatternRegex = new RegExp(`<pattern>${patternName}.+</pattern>`, "g");
            proc_text = proc_text.replace(specificPatternRegex, patternChecked.value);
        }
    });

    return proc_text;
}
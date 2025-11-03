import React from "react";
import { createRoot } from "react-dom/client";
import Mute from "./components/Mute";

let mutingRoot = null;

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
                console.log("checked: " + element.checked)
                console.log(instrument + ":")
                proc_text = proc_text.replace(instrument + ":", "_" + instrument + ":");
            }
        }
    });

    console.log(proc_text);
    proc_text = ProcessBPM(proc_text);
    globalEditor.setCode(proc_text);
}

export function ProcAndPlay(globalEditor) {
    if (globalEditor != null && globalEditor.repl.state.started == true) {
        console.log(globalEditor);
        Proc(globalEditor);
        globalEditor.evaluate();
    }
}

function ProcessText(match, ...args) {
    let replace = ""
    if (document.getElementById('flexRadioDefault2').checked) {
        replace = "_"
    }

    return replace
}

function ProcessBPM(proc_text) {
    // Regex to locate setcps
    const BPMRegex = /setcps\(.*\)/i;
    const BPMValue = document.getElementById('bpm').value;

    // Replace setcps with bpm input value
    let proc_text_replaced = proc_text.replace(BPMRegex, "setcps(" + BPMValue + ")");
    return proc_text_replaced;
}
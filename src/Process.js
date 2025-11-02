export function Proc(globalEditor) {
    let proc_text = document.getElementById('proc').value;
    let proc_text_replaced = proc_text.replaceAll('<p1_Radio>', ProcessText);
    //ProcessText(proc_text);
    proc_text_replaced = ProcessBPM(proc_text_replaced);
    globalEditor.setCode(proc_text_replaced);
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
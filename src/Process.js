export function Proc(globalEditor) {
    let proc_text = document.getElementById('proc').value
    let proc_text_replaced = proc_text.replaceAll('<p1_Radio>', ProcessText);
    //ProcessText(proc_text);
    globalEditor.setCode(proc_text_replaced)
}

function ProcessText(match, ...args) {
    let replace = ""
    if (document.getElementById('flexRadioDefault2').checked) {
        replace = "_"
    }

    return replace
}
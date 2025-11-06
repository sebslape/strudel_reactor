import './App.css';
import { useEffect, useRef, useState } from "react";
import { StrudelMirror } from '@strudel/codemirror';
import { evalScope } from '@strudel/core';
import { drawPianoroll } from '@strudel/draw';
import { initAudioOnFirstClick } from '@strudel/webaudio';
import { transpiler } from '@strudel/transpiler';
import { getAudioContext, webaudioOutput, registerSynthSounds } from '@strudel/webaudio';
import { registerSoundfonts } from '@strudel/soundfonts';
import { stranger_tune } from './tunes';
import console_monkey_patch, { getD3Data } from './console-monkey-patch';
import { Proc, ProcAndPlay } from './Process';
import Button from './components/Button';
import Accordion from './components/Accordion';
import handleD3Data from './D3';

export default function StrudelDemo() {
    const hasRun = useRef(false);

    let globalEditor = null;

    useEffect(() => {
        if (!hasRun.current) {
            document.addEventListener("d3Data", handleD3Data);
            console_monkey_patch();
            hasRun.current = true;
            //Code copied from example: https://codeberg.org/uzu/strudel/src/branch/main/examples/codemirror-repl
                //init canvas
                const canvas = document.getElementById('roll');
                canvas.width = canvas.width * 2;
                canvas.height = canvas.height * 2;
                const drawContext = canvas.getContext('2d');
                const drawTime = [-2, 2]; // time window of drawn haps
                globalEditor = new StrudelMirror({
                    defaultOutput: webaudioOutput,
                    getTime: () => getAudioContext().currentTime,
                    transpiler,
                    root: document.getElementById('editor'),
                    drawTime,
                    onDraw: (haps, time) => drawPianoroll({ haps, time, ctx: drawContext, drawTime, fold: 0 }),
                    prebake: async () => {
                        initAudioOnFirstClick(); // needed to make the browser happy (don't await this here..)
                        const loadModules = evalScope(
                            import('@strudel/core'),
                            import('@strudel/draw'),
                            import('@strudel/mini'),
                            import('@strudel/tonal'),
                            import('@strudel/webaudio'),
                        );
                        await Promise.all([loadModules, registerSynthSounds(), registerSoundfonts()]);
                    },
                });
                
            document.getElementById('proc').value = stranger_tune;
            Proc(globalEditor);
        }
    }, []);

    return (
        <div>
            <div className="navbar navbar-dark bg-dark p-2 text-center">
                <h2 className="text-white mx-auto mb-0">Strudel Demo</h2>
            </div>
            <div className="navbar bg-dark p-2 text-center justify-content-center gap-2">
                <Button action={() => ProcAndPlay(globalEditor)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M12 20q-3.35 0-5.675-2.325T4 12t2.325-5.675T12 4q1.725 0 3.3.712T18 6.75V4h2v7h-7V9h4.2q-.8-1.4-2.187-2.2T12 6Q9.5 6 7.75 7.75T6 12t1.75 4.25T12 18q1.925 0 3.475-1.1T17.65 14h2.1q-.7 2.65-2.85 4.325T12 20"/></svg>
                </Button>
                <Button action={() => globalEditor.evaluate()}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M8 17.175V6.825q0-.425.3-.713t.7-.287q.125 0 .263.037t.262.113l8.15 5.175q.225.15.338.375t.112.475t-.112.475t-.338.375l-8.15 5.175q-.125.075-.262.113T9 18.175q-.4 0-.7-.288t-.3-.712"/></svg>
                </Button>
                <Button action={() => globalEditor.stop()}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M6 18V6h12v12z"/></svg>
                </Button>
            </div>
            <main className="px-4 pt-4">
                <div className="container-fluid row">
                    <div className="col-md-8 p-0">
                        <h3 className="form-label text-white">Text to Preprocess:</h3>
                        <textarea className="form-control text-white mb-2" rows="15" id="proc" style={{resize: "none", backgroundColor: "#222", overflowY: "auto", maxHeight: "40vh", border: "none", outline: "0"}}></textarea>
                        <div id="editor" style={{overflowY: "auto", maxHeight: "40vh", borderRadius: "6px"}} />
                        <div id="output" />
                    </div>
                    <div className="col-md-4">
                        <h3 className="form-label text-white">Control Panel</h3>
                        <Accordion title={"Tempo"}>
                            <label htmlFor="bpm" className="text-white me-2">BPM</label>
                            <input type="text" id="bpm" defaultValue={"140/60/4"} onInput={() => ProcAndPlay(globalEditor)}></input>
                        </Accordion>
                        <Accordion title={"Muting"}></Accordion>
                        <Accordion title={"Patterns"}></Accordion>
                        <canvas id="roll" className="w-100"></canvas>
                    </div>
                </div>
            </main>
        </div>
    );
}
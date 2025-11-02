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
import Mute from './components/Mute';
import { Proc } from './Process';
import Button from './components/Button';

let globalEditor = null;

const handleD3Data = (event) => {
    console.log(event.detail);
};

export function ProcAndPlay() {
    if (globalEditor != null && globalEditor.repl.state.started == true) {
        console.log(globalEditor)
        Proc(globalEditor)
        globalEditor.evaluate();
    }
}

export default function StrudelDemo() {
    const hasRun = useRef(false);

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
                
            document.getElementById('proc').value = stranger_tune
            Proc(globalEditor)
        }
    }, []);

    return (
        <div>
            <div className="navbar navbar-dark bg-dark p-2 text-center">
                <h2 className="text-white mx-auto mb-0">Strudel Demo</h2>
            </div>
            <main className="px-4 pt-4" style={{backgroundColor: "#3A3A3A"}}>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-8 p-0" style={{ maxHeight: '50vh', overflowY: 'auto'}}>
                            <label htmlFor="exampleFormControlTextarea1" className="form-label text-white">Text to preprocess:</label>
                            <textarea className="form-control text-white" rows="15" id="proc" style={{resize: "none", backgroundColor: "#222"}}></textarea>
                        </div>
                        <div className="col-md-4">
                            <nav>
                                <Button action={() => Proc(globalEditor)}>Preprocess</Button>
                                <Button action={() => ProcAndPlay()}>Process & Play</Button>
                                <br />
                                <Button action={() => globalEditor.evaluate()}>Play</Button>
                                <Button action={() => globalEditor.stop()}>Stop</Button>
                            </nav>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-8 p-0" style={{ maxHeight: '50vh', overflowY: 'auto' }}>
                            <div id="editor" />
                            <div id="output" />
                        </div>
                        <div className="col-md-4">
                            <Mute />
                        </div>
                    </div>
                </div>
                <canvas id="roll"></canvas>
            </main >
        </div >
    );
}
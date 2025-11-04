import React, { useState } from 'react';
import { ProcAndPlay } from '../Process';

const Pattern = ({ patternName, choices, globalEditor }) => {
    let choicesHTML = [];

    let first = true;
    choices.forEach(choice => {
        if (first) {
            choicesHTML.push (
                <div className="form-check" key={choice}>
                    <input className="form-check-input" type="radio" name={patternName + "Pattern"} id={patternName + choice.toString()} value={choice} onChange={() => ProcAndPlay(globalEditor)} defaultChecked />
                    <label className="form-check-label text-white" htmlFor={patternName + choice.toString()}>
                        {patternName}: {choice}
                    </label>
                </div>
            )
            first = false;
        } else {
            choicesHTML.push (
                <div className="form-check" key={choice}>
                    <input className="form-check-input" type="radio" name={patternName + "Pattern"} id={patternName + choice.toString()} value={choice} onChange={() => ProcAndPlay(globalEditor)} />
                    <label className="form-check-label text-white" htmlFor={patternName + choice.toString()}>
                        {patternName}: {choice}
                    </label>
                </div>
            )
        } 
        
    });

    return (
        <div>
            {choicesHTML}
        </div>
    )
}

export default Pattern;
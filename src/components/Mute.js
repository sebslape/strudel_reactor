import React, { useState, useEffect } from 'react';
import { ProcAndPlay } from '../Process';

// A toggle button that can mute and unmute an instrument
const Mute = ({ instrument, globalEditor }) => {
    const [isMuted, setState] = useState(false);

    const onClick = () => {
        setState(!isMuted);
    };

    // Only process muted status after isMuted has changed
    useEffect(() => {
        ProcAndPlay(globalEditor);
    }, [isMuted]);

    let muteHTML = [];

    if (isMuted) {
        muteHTML.push(
            <button className="btn btn-outline-secondary" onClick={onClick} ismuted={isMuted.toString()} id={instrument + "Mute"} key={instrument}>{instrument}</button>
        )
    } else {
        muteHTML.push(
            <button className="btn btn-primary" onClick={onClick} ismuted={isMuted.toString()} id={instrument + "Mute"} key={instrument}>{instrument}</button>
        )
    }

    return (
        <div>
            {muteHTML}
        </div>
    )
}

export default Mute;
import React, { useState } from 'react';
import { ProcAndPlay } from '../Process';

const Mute = ({ instrument, globalEditor }) => {
    const [isMuted, setState] = useState(false);

    return (
        <div>
            <div className="form-check">
                <input className="form-check-input" type="radio" name={instrument} id={instrument + "On"} onChange={() => ProcAndPlay(globalEditor)} defaultChecked />
                <label className="form-check-label text-white" htmlFor="flexRadioDefault1">
                    {instrument}: ON
                </label>
            </div>
            <div className="form-check">
                <input className="form-check-input" type="radio" name={instrument} id={instrument + "Off"} onChange={() => ProcAndPlay(globalEditor)} />
                <label className="form-check-label text-white" htmlFor="flexRadioDefault2">
                    {instrument}: HUSH
                </label>
            </div>
        </div>
    )
}

export default Mute;
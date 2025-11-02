import React, { useState } from 'react';
import { ProcAndPlay } from '../Process';

const Mute = ({ }) => {
    const [isMuted, setState] = useState(false);

    return (
        <div>
            <div className="form-check">
                <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" onChange={ProcAndPlay} defaultChecked />
                <label className="form-check-label text-white" htmlFor="flexRadioDefault1">
                    p1: ON
                </label>
            </div>
            <div className="form-check">
                <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" onChange={ProcAndPlay} />
                <label className="form-check-label text-white" htmlFor="flexRadioDefault2">
                    p1: HUSH
                </label>
            </div>
        </div>
    )
}

export default Mute;
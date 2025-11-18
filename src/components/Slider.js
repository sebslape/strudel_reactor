import React from 'react';
import { ProcAndPlay } from '../Process';

// A slider that can be specified using the <slider>name:min:max</slider> format
const Slider = ({ sliderName, min, max, globalEditor, value=null }) => {
    if (value) {
        return (
            <div>
                <input type="range" name={sliderName + "Slider"} min={min} max={max} value={value} onChange={() => ProcAndPlay(globalEditor)}></input>
            </div>
        )
    } else {
        return (
            <div>
                <input type="range" name={sliderName + "Slider"} min={min} max={max} onChange={() => ProcAndPlay(globalEditor)}></input>
            </div>
        )
    }
}

export default Slider;
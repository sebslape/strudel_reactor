import React, { useState } from 'react';

const Button = ({action, children}) => {
    return (
        <div>
            <button id="process" className="btn btn-primary" onClick={action}>{children}</button>
        </div>
    )
}

export default Button;
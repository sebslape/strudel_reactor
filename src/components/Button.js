import React from 'react';

// A simple button which contains an action and text/children
const Button = ({action, children}) => {
    return (
        <div>
            <button id="process" className="btn btn-primary" onClick={action}>{children}</button>
        </div>
    )
}

export default Button;
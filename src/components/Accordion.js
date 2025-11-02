import React, { useState } from 'react';

const Accordion = ({title, children}) => {
    return (
        <details>
            <summary className="bg-primary p-2 text-white pb-2">{title}</summary>
            <div className="pb-4 pt-2">{children}</div>
        </details>
    )
}

export default Accordion;
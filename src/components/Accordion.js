import React from 'react';

// An accordion that can hide or show elements from view when clicked
const Accordion = ({title, children}) => {
    return (
        <details title={title}>
            <summary className="bg-primary p-2 text-white pb-2">{title}</summary>
            <div className="pb-4 pt-2 d-flex flex-wrap gap-2">{children}</div>
        </details>
    )
}

export default Accordion;
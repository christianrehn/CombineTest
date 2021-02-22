import React from 'react';
// import './Toggle.scss';

type ToggleProps = {
    checked?: boolean;
    handler?: () => void;
}

const Toggle = ({
                    handler = (): void => {
                    },
                }: ToggleProps) => {
    return (
        <label className="toggle">
            <input type="checkbox"
                   onChange={handler}
            />
            <span className="slider"></span>
        </label>
    );
}

export default Toggle;

import React from 'react';
import classes from './inputContainer.module.css';

export default function InputContainer({ label, bgColor, children, isPasswordVisible, togglePasswordVisibility }) {
    return (
        <div className={classes.container} style={{ backgroundColor: bgColor }}>
            <label className={classes.label}>{label}</label>
            <div className={classes.content}>{children}</div>
            {label === 'Password' || label === 'Confirm Password' ? (
                <div className={classes.passwordContainer}>
                    {isPasswordVisible ? (
                        <span className={classes.passwordOpen} onClick={togglePasswordVisibility}>🫣</span>
                    ) : (
                        <span className={classes.passwordClosed} onClick={togglePasswordVisibility}>🫢</span>
                    )}
                </div>
            ) : ''}
        </div>
    );
}

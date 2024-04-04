import React, { useState, forwardRef } from 'react';
import classes from './input.module.css';
import InputContainer from '../InputContainer/InputContainer';

function Input({ label, type, defaultValue, onChange, onBlur, name, error }, ref) {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(prevState => !prevState);
    };

    const getErrorMessage = () => {
        if (!error) return;
        if (error.message) return error.message;
        // default
        switch (error.type) {
            case 'required':
                return 'This Field Is Required';
            case 'minLength':
                return 'Field Is Too Short';
            default:
                return '*';
        }
    };

    return (
        <InputContainer
            label={label}
            isPasswordVisible={isPasswordVisible}
            togglePasswordVisibility={togglePasswordVisibility}
        >
            <input
                defaultValue={defaultValue}
                className={classes.input}
                type={label === 'Password' ? (isPasswordVisible ? 'text' : 'password') : label === 'Confirm Password' ? (isPasswordVisible ? 'text' : 'password') : type}
                placeholder={label}
                ref={ref}
                name={name}
                onChange={onChange}
                onBlur={onBlur}
            />
            {error && <div className={classes.error}>{getErrorMessage()}</div>}
        </InputContainer>
    );
}

export default forwardRef(Input);

import React from "react";
import "./Input.css";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ id, label, error, ...rest }) => {
  return (
    <div className="input-group">
      {label && (
        <label htmlFor={id} className="input-label">
          {label}
        </label>
      )}
      <input id={id} className={`input-field ${error ? "input-error" : ""} ${rest.disabled ? "is-disabled" : ""}`} {...rest}/>
      {error && <span className="text-error">{error}</span>}
    </div>
  );
};

export default Input;

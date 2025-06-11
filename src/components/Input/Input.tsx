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
      <input id={id} className={`input-field ${error ? "has-error" : ""}`} {...rest} />
      {error && <span className="input-error">{error}</span>}
    </div>
  );
};

export default Input;

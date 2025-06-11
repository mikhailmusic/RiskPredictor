import { useState, useRef, useEffect } from "react";
import ChevronDown from "../../assets/icons/ChevronDown";
import "./Dropdown.css";

export interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps {
  id: string;
  label?: string;
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
}

const Dropdown: React.FC<DropdownProps> = ({ id, label, options, value, onChange, placeholder = "Выберите...", disabled = false, error }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`dropdown-group ${disabled ? "disabled" : ""}`} ref={ref}>
      {label && (
        <label htmlFor={id} className="dropdown-label">
          {label}
        </label>
      )}
      <div
        className={`dropdown-display ${open ? "open" : ""} ${error ? "has-error" : ""}`}
        onClick={() => !disabled && setOpen((prev) => !prev)}
      >
        <span className="dropdown-selected">{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown className="dropdown-arrow"/>
      </div>
      {open && (
        <ul className="dropdown-options">
          {options.map((option) => (
            <li
              key={option.value}
              className={`dropdown-option ${option.value === value ? "selected" : ""}`}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
      {error && <div className="dropdown-error">{error}</div>}
    </div>
  );
};

export default Dropdown;

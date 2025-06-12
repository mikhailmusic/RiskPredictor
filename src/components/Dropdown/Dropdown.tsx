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

const Dropdown: React.FC<DropdownProps> = ({
  id,
  label,
  options,
  value,
  onChange,
  placeholder = "Не выбрано",
  disabled = false,
  error
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
        setFocusedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;

    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        if (open && focusedIndex >= 0) {
          onChange(options[focusedIndex].value);
          setOpen(false);
        } else {
          setOpen((prev) => !prev);
        }
        break;
      case "Escape":
        setOpen(false);
        setFocusedIndex(-1);
        break;
      case "ArrowDown":
        e.preventDefault();
        if (!open) {
          setOpen(true);
          setFocusedIndex(0);
        } else {
          setFocusedIndex((prev) => Math.min(prev + 1, options.length - 1));
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (open) {
          setFocusedIndex((prev) => Math.max(prev - 1, 0));
        }
        break;
    }
  };

  return (
    <div className={`dropdown-group ${disabled ? "disabled" : ""}`} ref={ref}>
      {label && (
        <label htmlFor={id} className="dropdown-label">
          {label}
        </label>
      )}
      <div
        id={id}
        className={`dropdown-display ${open ? "open" : ""} ${error ? "has-error" : ""}`}
        tabIndex={0}
        onClick={() => !disabled && setOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
      >
        <span className="dropdown-selected">{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown className="dropdown-arrow" />
      </div>
      {open && (
        <ul className="dropdown-options">
          {options.map((option, idx) => (
            <li
              key={option.value}
              className={`dropdown-option 
                ${option.value === value ? "selected" : ""} 
                ${focusedIndex === idx ? "focused" : ""}
              `}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
                setFocusedIndex(-1);
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

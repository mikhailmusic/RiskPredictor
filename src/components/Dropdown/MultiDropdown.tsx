import { useState, useRef, useEffect } from "react";
import ChevronDown from "../../assets/icons/ChevronDown";
import "./multi.dropdown.css";

export interface MultiOption {
  label: string;
  value: string;
}

interface MultiDropdownProps {
  id: string;
  label?: string;
  options: MultiOption[];
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
}

const MultiDropdown: React.FC<MultiDropdownProps> = ({
  id,
  label,
  options,
  values,
  onChange,
  placeholder = "Не выбрано",
  disabled = false,
  error
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
        setFocusedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const toggleOption = (value: string) => {
    const newValues = values.includes(value) ? values.filter((v) => v !== value) : [...values, value];
    onChange(newValues);
  };

  const selectedLabels = options
    .filter((opt) => values.includes(opt.value))
    .map((opt) => opt.label)
    .join(", ");

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        if (open) {
          if (focusedIndex >= 0) toggleOption(options[focusedIndex].value);
        } else {
          setOpen(true);
          setFocusedIndex(0);
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
    <div className={`multi-dropdown-group ${disabled ? "multi-disabled" : ""}`} ref={ref}>
      {label && (
        <label htmlFor={id} className="multi-dropdown-label">
          {label}
        </label>
      )}
      <div
        id={id}
        className={`multi-dropdown-display ${open ? "open" : ""} ${error ? "has-error" : ""}`}
        tabIndex={0}
        onClick={() => !disabled && setOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
      >
        <span className="multi-dropdown-selected" title={selectedLabels}>{selectedLabels || placeholder}</span>
        <ChevronDown className="multi-dropdown-arrow" />
      </div>
      {open && (
        <ul className="multi-dropdown-options">
          {options.map((option, idx) => (
            <li
              key={option.value}
              className={`multi-dropdown-option ${values.includes(option.value) ? "selected" : ""} ${focusedIndex === idx ? "focused" : ""}`}
              onClick={() => toggleOption(option.value)}
            >
              <input type="checkbox" readOnly checked={values.includes(option.value)} />
              {option.label}
            </li>
          ))}
        </ul>
      )}
      {error && <div className="multi-dropdown-error">{error}</div>}
    </div>
  );
};

export default MultiDropdown;

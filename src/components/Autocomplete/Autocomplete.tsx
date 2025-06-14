import { useState, useRef, useEffect } from "react";
import "./autocomplete.css";

interface AutocompleteProps {
  id: string;
  label?: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
}

const Autocomplete: React.FC<AutocompleteProps> = ({ id, label, options, value, onChange, error, placeholder }) => {
  const [inputValue, setInputValue] = useState(value);
  const [showOptions, setShowOptions] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const optionRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [throttle, setThrottle] = useState(false);

  const inputValueLower = inputValue.toLowerCase();

  const filteredOptions = options
    .filter((opt) => opt.toLowerCase().includes(inputValueLower))
    .sort((a, b) => {
      const aStarts = a.toLowerCase().startsWith(inputValueLower);
      const bStarts = b.toLowerCase().startsWith(inputValueLower);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return a.length - b.length;
    });

  const handleSelect = (val: string) => {
    setInputValue(val);
    onChange(val);
    setShowOptions(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showOptions || filteredOptions.length === 0 || throttle) return;

    if (["ArrowDown", "ArrowUp", "Enter", "Escape"].includes(e.key)) {
      e.preventDefault();
    }

    if (e.key === "ArrowDown") {
      setActiveIndex((prev) => Math.min(prev + 1, filteredOptions.length - 1));
    } else if (e.key === "ArrowUp") {
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && activeIndex < filteredOptions.length) {
        handleSelect(filteredOptions[activeIndex]);
      }
    } else if (e.key === "Escape") {
      setShowOptions(false);
      setActiveIndex(-1);
    }

    setThrottle(true);
    setTimeout(() => setThrottle(false), 100);
  };

  useEffect(() => {
    if (activeIndex >= 0 && optionRefs.current[activeIndex]) {
      optionRefs.current[activeIndex]!.scrollIntoView({
        block: "nearest"
      });
    }
  }, [activeIndex]);

  return (
    <div className="autocomplete-group">
      {label && (
        <label htmlFor={id} className="input-label">
          {label}
        </label>
      )}

      <div className="autocomplete-wrapper">
        <input
          id={id}
          type="text"
          className={`input-field ${error ? "input-error" : ""}`}
          value={inputValue}
          placeholder={placeholder}
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowOptions(true);
            setActiveIndex(-1);
          }}
          onFocus={() => setShowOptions(true)}
          onBlur={() => {
            setTimeout(() => {
              setShowOptions(false);
              setActiveIndex(-1);
            }, 100);
          }}
          onKeyDown={handleKeyDown}
        />

        {showOptions && filteredOptions.length > 0 && (
          <ul className="autocomplete-list custom-scroll">
            {filteredOptions.map((opt, index) => (
              <li
                key={opt}
                ref={(el) => (optionRefs.current[index] = el)}
                onMouseDown={() => handleSelect(opt)}
                className={`autocomplete-item ${index === activeIndex ? "focused" : ""}`}
              >
                {opt}
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && <span className="text-error">{error}</span>}
    </div>
  );
};

export default Autocomplete;

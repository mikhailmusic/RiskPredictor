import "./button.css";

type ButtonVariant = "primary" | "secondary" | "danger";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  fullWidth?: boolean;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, variant = "primary", fullWidth = false, loading = false, disabled, ...rest }) => {
  const className = `btn btn-${variant} ${fullWidth ? "btn-full" : ""}`;

  return (
    <button className={className} disabled={disabled || loading} {...rest}>
      {loading ? "Загрузка..." : children}
    </button>
  );
};

export default Button;

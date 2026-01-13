type ButtonProps = {
  children: React.ReactNode;
  type?: 'button' | 'submit';
  disabled?: boolean;
};

export function Button({
  children,
  type = 'button',
  disabled = false,
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className="w-full rounded-md bg-black px-4 py-2 text-white hover:bg-gray-800 disabled:opacity-50"
    >
      {children}
    </button>
  );
}

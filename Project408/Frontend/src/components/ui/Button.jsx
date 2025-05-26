export function Button({ children, ...props }) {
  return (
    <button
      {...props}
      className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-all"
    >
      {children}
    </button>
  );
}

  
export function ReportButton({ children, ...props }) {
  return (
    <button
      {...props}
      className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition-all"
    >
      {children}
    </button>
  );
}
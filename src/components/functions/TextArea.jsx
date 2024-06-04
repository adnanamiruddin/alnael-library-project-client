export default function TextArea({ name, value, onChange, placeholder, rows }) {
  return (
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows ? rows : 3}
      className="mt-4 textarea w-full bg-white text-black border border-amber-400 focus:border-amber-300 focus:border-2"
    ></textarea>
  );
}

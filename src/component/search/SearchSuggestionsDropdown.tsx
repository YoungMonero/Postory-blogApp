interface Props {
  visible: boolean;
  loading: boolean;
  results: any[];
}

export const SearchSuggestionsDropdown = ({
  visible,
  loading,
  results,
}: Props) => {
  if (!visible) return null;

  if (loading) {
    return (
      <div className="absolute z-50 mt-2 w-full rounded-xl bg-white shadow-lg border p-3 text-sm text-gray-500">
        Searching…
      </div>
    );
  }

  if (!Array.isArray(results) || results.length === 0) {
    return (
      <div className="absolute z-50 mt-2 w-full rounded-xl bg-white shadow-lg border p-3 text-sm text-gray-500">
        No results found
      </div>
    );
  }

  return (
    <div className="absolute z-50 mt-2 w-full rounded-xl bg-white shadow-lg border overflow-hidden">
      {results.map((item, index) => (
        <div
          key={index}
          className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm"
        >
          {item.name || item.title || item.username || 'Untitled'}
        </div>
      ))}
    </div>
  );
};















// interface Props {
//   visible: boolean;
//   loading: boolean;
//   results: any[];
// }

// export function SearchSuggestionsDropdown({
//   visible,
//   loading,
//   results,
// }: Props) {
//   if (!visible) return null;

//   return (
//     <div className="absolute top-full mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-lg z-50">
//       {loading && (
//         <div className="p-3 text-sm text-gray-400">Searching…</div>
//       )}

//       {!loading && results.length === 0 && (
//         <div className="p-3 text-sm text-gray-400">No results</div>
//       )}

//       {results.map(item => (
//         <div
//           key={item.id}
//           className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm"
//         >
//           {item.title}
//           <span className="ml-2 text-xs text-gray-400 uppercase">
//             {item.type}
//           </span>
//         </div>
//       ))}
//     </div>
//   );
// }

type SearchProps = {
  value: string;
  onChange: (value: string) => void;
};

const Search = ({ value, onChange }: SearchProps) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-white" htmlFor="pokemon-search">
        Search Pokémon
      </label>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          id="pokemon-search"
          name="pokemon-search"
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Search by name or dex number"
          className="w-full rounded-full border border-white/50 bg-white/90 px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm outline-none transition focus:border-pokedex-blue focus:bg-white"
        />
        <span className="text-xs text-white/80">
          Results update as you type.
        </span>
      </div>
    </div>
  );
};

export default Search;

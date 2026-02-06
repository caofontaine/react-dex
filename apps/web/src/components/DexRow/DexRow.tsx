import type { DexEntry } from '@react-dex/shared';

type DexRowProps = {
  entry: DexEntry;
  caught: boolean;
  onToggleCaught: (dexNum: string) => void;
};

const DexRow = ({ entry, caught, onToggleCaught }: DexRowProps) => {
  const formatImgName = entry.name
    .toLowerCase()
    .replace(/[\s']+/g, '')
    .replace(/\.+/g, '-')
    .replace(/♀+/g, '-f')
    .replace(/♂+/g, '-m');

  const spriteUrl = `https://img.pokemondb.net/sprites/home/normal/2x/avif/${formatImgName}.avif`;

  return (
    <tr className="border-b border-slate-200/70 even:bg-slate-50/60">
      <td className="px-4 py-3 text-sm font-semibold text-slate-800">{entry.dexnum}</td>
      <td className="px-4 py-3">
        <img className="h-12 w-12" src={spriteUrl} alt={entry.name} loading="lazy" />
      </td>
      <td className="px-4 py-3 text-sm font-semibold text-slate-900">{entry.name}</td>
      <td className="px-4 py-3 text-sm text-slate-700">{entry.type1}</td>
      <td className="px-4 py-3 text-sm text-slate-700">{entry.type2 ?? '—'}</td>
      <td className="px-4 py-3 text-center">
        <input
          type="checkbox"
          id={`caught-${entry.dexnum}`}
          name={`caught-${entry.dexnum}`}
          checked={caught}
          onChange={() => onToggleCaught(entry.dexnum)}
          aria-label={`Mark ${entry.name} as caught`}
          className="h-4 w-4 accent-pokedex-blue"
        />
      </td>
    </tr>
  );
};

export default DexRow;

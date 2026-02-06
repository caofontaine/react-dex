import type { DexEntry } from '@react-dex/shared';
import DexRow from '../DexRow/DexRow';

type DexListProps = {
  dex: DexEntry[];
  caughtDex: Set<string>;
  onToggleCaught: (dexNum: string) => void;
};

const DexList = ({ dex, caughtDex, onToggleCaught }: DexListProps) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/40 bg-white shadow-card">
      <table className="w-full border-collapse text-left">
        <caption className="sr-only">Kanto Pokédex</caption>
        <thead className="bg-pokedex-blue text-white">
          <tr>
            <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wider">
              Dex #
            </th>
            <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wider">
              Sprite
            </th>
            <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wider">
              Name
            </th>
            <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wider">
              Type 1
            </th>
            <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wider">
              Type 2
            </th>
            <th scope="col" className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">
              Caught
            </th>
          </tr>
        </thead>
        <tbody>
          {dex.map((pokemon) => (
            <DexRow
              key={pokemon.dexnum}
              entry={pokemon}
              caught={caughtDex.has(pokemon.dexnum)}
              onToggleCaught={onToggleCaught}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DexList;

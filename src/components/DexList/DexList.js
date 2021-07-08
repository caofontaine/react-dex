import React from 'react';
import DexRow from '../DexRow/DexRow';
import './DexList.css';

const DexList = ({ dex }) => {
	return (

      <table>
				<thead>
	        <tr>
	          <th>#</th>
	          <th>&nbsp;</th>
	          <th>Name</th>
	          <th>Type 1</th>
	          <th>Type 2</th>
	          <th>Shiny</th>
	        </tr>
				</thead>

				<tbody>
					{
						dex.map(pokemon => {
							return (
								<DexRow
									key={pokemon.dexnum + '*'}
									dexNum={pokemon.dexnum}
									name={pokemon.name}
									type1={pokemon.type1}
									type2={pokemon.type2}
									region={pokemon.region}
								/>
							)
						})
					}
				</tbody>
      </table>

	)
}

export default DexList;

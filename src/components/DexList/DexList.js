import React from 'react';
import DexRow from '../DexRow/DexRow';
import './DexList.css';

const DexList = ({ dex }) => {
	return (

      <table>
        <tr>
          <th>#</th>
          <th>&nbsp;</th>
          <th>Name</th>
          <th>Type 1</th>
          <th>Type 2</th>
          <th>Caught</th>
          <th>Shiny</th>
        </tr>

				{
					dex.map(pokemon => {
						return (
							<DexRow
								key={pokemon.dexnum}
								dexNum={pokemon.dexnum}
								name={pokemon.name}
								type={pokemon.type}
								region={pokemon.region} // Will become region name from API.
							/>
						)
					})
				}
      </table>

	)
}

export default DexList;

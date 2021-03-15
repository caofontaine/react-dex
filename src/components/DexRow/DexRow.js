import React from 'react';
import './DexRow.css';

const DexRow = ({ dexNum, name, type, region }) => {
	const types = type.split(',');
	if (types.length === 1) types.push(' ');
	return (
		<tr>
			<td>{dexNum}</td>

			<td><img class="sprite" src={`/img/normal/${region.toLowerCase()}/${name.toLowerCase()}.png`} alt={name.toLowerCase()} /></td>

			<td>{name}</td>
			{
				types.map(t => {
					return (<td>{t}</td>)
				})
			}

			<td><input type="checkbox" id={name.toLowerCase()} name={name.toLowerCase()} value={name}  /></td>
			<td><input type="checkbox" id={`shiny${name.toLowerCase()}`} name={`shiny${name.toLowerCase()}`} value={`Shiny${name}`} /></td>
		</tr>
	)
}

export default DexRow;

//<td><img class="sprite" src="img/normal/kanto/bulbasaur.png" alt="bulbasaur" /></td>

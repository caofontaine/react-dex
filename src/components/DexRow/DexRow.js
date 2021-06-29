import React from 'react';
import './DexRow.css';

const DexRow = ({ dexNum, name, type1, type2, region }) => {
	const formatImgName = name.toLowerCase()
														.replace(/[\s']+/g, '') // Removes whitespace or '
														.replace(/\.+/g, '-') // Replaces . with -
														.replace(/♀+/g, '-f') // Replaces female symbol with -f
														.replace(/♂+/g, '-m'); // Replaces male symbol with -m
	const url = 'https://img.pokemondb.net/sprites/home';

	const click = (event) => {
		const img = document.getElementsByClassName(formatImgName)[0];
		event.target.checked ? img.src = `${url}/shiny/${formatImgName}.png` : img.src = `${url}/normal/${formatImgName}.png`;
	}

	return (
		<tr>
			<td>{dexNum}</td>

			<td><img className={`sprite ${formatImgName}`} src={`${url}/normal/${formatImgName}.png`} alt={name.toLowerCase()} /></td>

			<td>{name}</td>

			<td>{type1}</td>
			<td>{type2}</td>

			<td><input type="checkbox" id={`shiny${formatImgName}`} name={`shiny${formatImgName}`} value={`Shiny${name}`} onClick={click} /></td>
		</tr>
	)
}

export default DexRow;

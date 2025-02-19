export function getRandomColor(): string {
	const colors = [
		'cadetblue',
		'darkslateblue',
		'deepskyblue',
		'navy',
		'royalblue',
		'cornflowerblue',
		'teal',
		'purple',
		'slateblue',
		'indigo',
	];
	const index = Math.floor(Math.random() * colors.length);
	return colors[index];
}

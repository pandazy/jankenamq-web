import SongRow from './SongRow';

import { SchemaDataRowParented } from '~/app-contents/api-calls';
import { useLearningOfSongsMap } from '~/app-contents/info/learning/api-calls';

import { DataList, useSchemaChecks } from '@pandazy/jankenstore-client-web';

export default function SongList({
	songs,
	from,
}: {
	songs: SchemaDataRowParented[];
	from?: ['artist' | 'show', SchemaDataRowParented];
}) {
	const { pkField } = useSchemaChecks();
	const songIds = songs.map(
		(song) => song[pkField('song').unwrap()],
	) as string[];
	const { data: learningMap, isLoading: learningIsLoading } =
		useLearningOfSongsMap(songIds);

	return (
		<>
			<DataList
				data={songs ?? []}
				isLoading={learningIsLoading}
				makeItemContent={(item: SchemaDataRowParented) => (
					<SongRow
						song={item}
						from={from}
						learning={learningMap?.[item.id as string]}
					/>
				)}
			/>
		</>
	);
}

import SongRow from './SongRow';

import { SchemaDataRowParented } from '~/app-contents/api-calls';
import { useLearningOfSongsMap } from '~/app-contents/info/learning/api-calls';

import { DataList, useSchemaChecks } from '@pandazy/jankenstore-client-web';
import { getMediaUrlMap } from './api-calls';
import { useQuery } from '@tanstack/react-query';

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
	const { data: learningMap, isFetching: learningIsLoading } =
		useLearningOfSongsMap(songIds);
	const { data: mediaUrlMap, isFetching: mediaUrlIsLoading } = useQuery({
		queryKey: ['media_url_map', songIds],
		queryFn: () => getMediaUrlMap(songIds),
	});

	return (
		<>
			<DataList
				data={songs ?? []}
				isLoading={learningIsLoading || mediaUrlIsLoading}
				makeItemContent={(item: SchemaDataRowParented) => (
					<SongRow
						song={item}
						from={from}
						learning={learningMap?.[item.id as string]}
						media_urls={mediaUrlMap?.[item.id as string]}
					/>
				)}
			/>
		</>
	);
}

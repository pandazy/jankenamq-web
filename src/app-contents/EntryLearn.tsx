import Frame from './Frame';
import {
	allLearnings,
	SchemaDataRowParented,
	useLearningMap,
	useSchemaQuery,
} from './api-calls';

import { ReactElement } from 'react';
import { SongCells } from './info/Song';
import { DataList } from '@pandazy/jankenstore-client-web';

export default function EntryLearn(): ReactElement {
	const { data, isLoading } = useSchemaQuery(
		{
			table: 'learning',
			fillParent: true,
		},
		{
			queryKey: ['learning'],
			queryFn: async () => allLearnings(),
		},
	);
	const songIds = data?.records.map((learning) => learning.song_id) ?? [];
	const { data: learningMap, isLoading: learningIsLoading } = useLearningMap(
		songIds as string[],
	);
	console.log(learningMap);
	return (
		<Frame forRoute="learn">
			<h1>Learning songs</h1>
			<DataList
				data={data?.records ?? []}
				isLoading={isLoading || learningIsLoading}
				makeItemContent={(item: SchemaDataRowParented) => {
					return (
						<SongCells
							song={item.$parents?.song as SchemaDataRowParented}
							learning={
								learningMap?.[item.$parents?.song.id as string]
							}
						/>
					);
				}}
			/>
		</Frame>
	);
}

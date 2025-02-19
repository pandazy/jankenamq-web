import { dueLearning, useLearningMap } from './info/learning/api-calls';
import Frame from './Frame';
import { SchemaDataRowParented, useSchemaQuery } from './api-calls';
import { QueryKeys } from './info/query-keys';
import { SongRow } from './info/Song';

import { DataList } from '@pandazy/jankenstore-client-web';

import { ReactElement } from 'react';

export default function EntryLearn(): ReactElement {
	const { data, isLoading } = useSchemaQuery(
		{
			table: 'learning',
			fillParent: true,
		},
		{
			queryKey: [QueryKeys.learning],
			queryFn: async () => dueLearning(),
		},
	);
	const songIds = data?.records.map((learning) => learning.song_id) ?? [];
	const { data: learningMap, isLoading: learningIsLoading } = useLearningMap(
		songIds as string[],
	);
	return (
		<Frame forRoute="learn">
			<h1>Learning songs</h1>
			<DataList
				data={data?.records ?? []}
				isLoading={isLoading || learningIsLoading}
				makeItemContent={(item: SchemaDataRowParented) => {
					return (
						<SongRow
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

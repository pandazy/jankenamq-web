import Frame from './Frame';
import {
	allLearnings,
	SchemaDataRowParented,
	useSchemaQuery,
} from './api-calls';
import DataList from './info/DataList';

import { ReactElement } from 'react';
import { SongCells } from './info/Song';

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
	return (
		<Frame forRoute="learn">
			<h1>Learning songs</h1>
			<DataList
				data={data ?? []}
				isLoading={isLoading}
				makeItemContent={(item: SchemaDataRowParented) => {
					return (
						<SongCells
							song={item.$parents?.song as SchemaDataRowParented}
						/>
					);
				}}
			/>
		</Frame>
	);
}

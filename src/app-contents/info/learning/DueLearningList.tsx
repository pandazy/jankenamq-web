import { useLearningMap, dueLearning } from './api-calls';

import { QueryKeys } from '~/app-contents/info/query-keys';
import { SchemaDataRowParented } from '~/app-contents/api-calls';
import { SongRow } from '~/app-contents/info/Song';
import { useSchemaQuery } from '~/app-contents/api-calls';
import NoRecords from '~/app-contents/info/NoRecords';

import { DataList } from '@pandazy/jankenstore-client-web';

import { Badge } from '@mui/material';
import { ReactElement } from 'react';

export default function DueLearningList(): ReactElement {
	const { data, isLoading } = useSchemaQuery(
		{
			table: 'learning',
			fillParent: true,
		},
		{
			queryKey: [QueryKeys.learning, QueryKeys.song, 'due'],
			queryFn: async () => dueLearning(),
		},
	);
	const songIds = data?.records.map((learning) => learning.song_id) ?? [];
	const { data: learningMap, isLoading: learningIsLoading } = useLearningMap(
		songIds as string[],
	);

	if (data?.total === 0) {
		return <NoRecords message="No due learning songs" />;
	}

	return (
		<>
			<h1>
				<Badge color="warning" badgeContent={data?.total} max={100000}>
					Time to level up!
				</Badge>
			</h1>
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
		</>
	);
}

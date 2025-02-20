import { allLearnings, useLearningMap } from './api-calls';

import { QueryKeys } from '~/app-contents/info/query-keys';
import { SongRow } from '~/app-contents/info/Song';
import NoRecords from '~/app-contents/info/NoRecords';
import {
	SchemaDataRowParented,
	useSchemaQuery,
} from '~/app-contents/api-calls';

import { DataList } from '@pandazy/jankenstore-client-web';

import { Badge } from '@mui/material';
import { ReactElement } from 'react';

export default function AllLearningList(): ReactElement {
	const { data, isLoading } = useSchemaQuery(
		{
			table: 'learning',
			fillParent: true,
		},
		{
			queryKey: [QueryKeys.learning, QueryKeys.song, 'all'],
			queryFn: async () => allLearnings(),
		},
	);
	const songIds = data?.records.map((learning) => learning.song_id) ?? [];
	const { data: learningMap, isLoading: learningIsLoading } = useLearningMap(
		songIds as string[],
	);

	if (data?.total === 0) {
		return <NoRecords message="No learning songs" />;
	}

	return (
		<>
			<h1>
				<Badge
					color="secondary"
					badgeContent={data?.total}
					max={100000}
				>
					All learning songs
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

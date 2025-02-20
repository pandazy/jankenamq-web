import { allLearnings, useLearningQuery } from './api-calls';

import { SongRow } from '~/app-contents/info/Song';
import { SchemaDataRowParented } from '~/app-contents/api-calls';

import { DataList } from '@pandazy/jankenstore-client-web';

import { Badge, Typography } from '@mui/material';
import { ReactElement } from 'react';

export default function AllLearningList(): ReactElement {
	const { data, isLoading } = useLearningQuery(async () => allLearnings());

	return (
		<>
			<Typography variant="h4" component="p" sx={{ p: 2 }}>
				<Badge
					color="secondary"
					badgeContent={data?.total}
					max={100000}
				>
					All learning songs
				</Badge>
			</Typography>
			<DataList
				data={data?.records ?? []}
				isLoading={isLoading}
				makeItemContent={(learning: SchemaDataRowParented) => {
					return (
						<SongRow
							song={
								learning.$parents?.song as SchemaDataRowParented
							}
							learning={learning}
						/>
					);
				}}
			/>
		</>
	);
}

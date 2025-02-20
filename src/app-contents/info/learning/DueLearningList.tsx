import { dueLearning, useLearningQuery } from './api-calls';

import { SchemaDataRowParented } from '~/app-contents/api-calls';
import { SongRow } from '~/app-contents/info/Song';
import NoRecords from '~/app-contents/info/NoRecords';

import { DataList } from '@pandazy/jankenstore-client-web';

import { Badge, Typography } from '@mui/material';
import { ReactElement } from 'react';

export default function DueLearningList(): ReactElement {
	const { data, isLoading } = useLearningQuery(async () => dueLearning());

	if (data?.total === 0) {
		return <NoRecords message="No due learning songs" />;
	}

	return (
		<>
			<Typography variant="h4" component="p" sx={{ p: 2 }}>
				<Badge color="warning" badgeContent={data?.total} max={100000}>
					Time to level up!
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

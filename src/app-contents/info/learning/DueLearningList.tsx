import { dueLearning, useLearningQuery } from './api-calls';

import { SchemaDataRowParented } from '~/app-contents/api-calls';
import { SongRow } from '~/app-contents/info/Song';
import NoRecords from '~/app-contents/info/NoRecords';
import { Paginator } from '~/app-contents/info/Paginator';
import { usePagination } from '~/app-contents/util-hooks';

import { DataList } from '@pandazy/jankenstore-client-web';

import { Badge, Typography } from '@mui/material';
import { ReactElement, useState } from 'react';

export default function DueLearningList(): ReactElement {
	const limit = 10;
	const [offset, setOffset] = useState(0);
	const { data, isLoading } = useLearningQuery({
		queryFn: async () => dueLearning(limit, offset),
		queryKeys: [offset, limit],
	});
	const { page, turnToPage, totalPages } = usePagination(
		data?.total ?? 0,
		setOffset,
		10,
	);

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
			{totalPages > 1 && (
				<Paginator
					total={data?.total ?? 0}
					page={page}
					turnToPage={turnToPage}
					totalPages={totalPages}
				/>
			)}
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

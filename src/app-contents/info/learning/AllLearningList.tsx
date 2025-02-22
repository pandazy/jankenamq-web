import { allLearnings, useLearningQuery } from './api-calls';

import { SongRow } from '~/app-contents/info/Song';
import { SchemaDataRowParented } from '~/app-contents/api-calls';

import { DataList } from '@pandazy/jankenstore-client-web';

import { Badge, Typography } from '@mui/material';
import { ReactElement, useState } from 'react';
import { usePagination } from '~/app-contents/util-hooks';
import { Paginator } from '~/app-contents/info/Paginator';

export default function AllLearningList(): ReactElement {
	const limit = 10;
	const [offset, setOffset] = useState(0);
	const { data, isFetching } = useLearningQuery({
		queryFn: async () => allLearnings({ limit, offset }),
		queryKeys: [offset, limit],
	});
	const { page, turnToPage, totalPages } = usePagination(
		data?.total ?? 0,
		setOffset,
		limit,
	);

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
				isLoading={isFetching}
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

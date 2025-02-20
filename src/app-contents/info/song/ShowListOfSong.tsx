import { ShowRow } from '~/app-contents/info/Show';
import { SchemaDataRowParented } from '~/app-contents/api-calls';
import { QueryKeys } from '~/app-contents/info/query-keys';
import { peers } from '~/app-contents/api-calls';
import { Paginator } from '~/app-contents/info/Paginator';
import { usePagination } from '~/app-contents/util-hooks';

import {
	Piece,
	SchemaDataRow,
	PopCardList,
} from '@pandazy/jankenstore-client-web';

import { useQuery } from '@tanstack/react-query';
import { Typography } from '@mui/material';
import { useState } from 'react';

export default function ShowListOfSong({
	song,
}: {
	song: SchemaDataRowParented;
}) {
	const limit = 5;
	const [offset, setOffset] = useState(0);
	const { data, isLoading } = useQuery({
		queryKey: [QueryKeys.show, QueryKeys.song, song.id],
		queryFn: () =>
			peers(
				'show',
				{
					song: [song.id as string],
				},
				limit,
				offset,
			),
	});
	const { page, turnToPage, totalPages } = usePagination(
		data?.total ?? 0,
		setOffset,
		limit,
	);
	return (
		<PopCardList
			header={
				<>
					<Typography variant="caption">
						Shows of{' '}
						<b>
							<Piece
								table="song"
								srcRow={song as SchemaDataRow}
								col="name"
							/>
						</b>
					</Typography>
					{totalPages > 1 && (
						<Paginator
							total={data?.total ?? 0}
							page={page}
							turnToPage={turnToPage}
							totalPages={totalPages}
						/>
					)}
				</>
			}
			data={data?.records ?? []}
			isLoading={isLoading}
			makeItemContent={(item: SchemaDataRowParented) => (
				<ShowRow
					show={item as SchemaDataRow}
					from={['song', song as SchemaDataRow]}
				/>
			)}
		/>
	);
}

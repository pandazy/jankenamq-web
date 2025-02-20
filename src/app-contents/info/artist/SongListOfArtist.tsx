import { children } from '~/app-contents/api-calls';
import { SchemaDataRowParented } from '~/app-contents/api-calls';
import { SongList } from '~/app-contents/info/Song';
import { QueryKeys } from '~/app-contents/info/query-keys';
import { usePagination } from '~/app-contents/util-hooks';
import { Paginator } from '~/app-contents/info/Paginator';

import {
	useSchemaPk,
	SchemaDataRow,
	PopCard,
	AnimatedLoadingBar,
	Piece,
} from '@pandazy/jankenstore-client-web';

import { useQuery } from '@tanstack/react-query';
import { Alert, Stack } from '@mui/material';
import { useState } from 'react';

export default function SongListOfArtist({
	artist,
	table,
}: {
	table: string;
	artist: SchemaDataRowParented;
}) {
	const { pk, error, hasError } = useSchemaPk<string>(
		table,
		artist as SchemaDataRow,
	);
	const limit = 5;
	const [offset, setOffset] = useState(0);
	const { data, isLoading } = useQuery({
		queryKey: [QueryKeys.artist, QueryKeys.song, pk ?? '', limit, offset],
		queryFn: () => children('song', 'artist', [pk ?? ''], limit, offset),
		enabled: !hasError,
	});
	const { page, turnToPage, totalPages } = usePagination(
		data?.total ?? 0,
		setOffset,
		limit,
	);

	if (hasError) {
		return <Alert severity="error">{(error as Error).message}</Alert>;
	}

	return (
		<>
			<PopCard
				header={
					<>
						<span>Songs by </span>
						<b>
							<Piece
								table="artist"
								srcRow={artist as SchemaDataRow}
								col="name"
							/>
						</b>
						{totalPages > 1 && (
							<Stack
								direction="row"
								justifyContent="space-between"
								sx={{ mt: 2 }}
							>
								<Paginator
									total={data?.total ?? 0}
									page={page}
									turnToPage={turnToPage}
									totalPages={totalPages}
								/>
							</Stack>
						)}
					</>
				}
				cardContentProps={{
					sx: { height: 'fit-content' },
				}}
			>
				<AnimatedLoadingBar isLoading={isLoading} />
				<SongList
					songs={data?.records ?? []}
					from={['artist', artist]}
				/>
			</PopCard>
		</>
	);
}

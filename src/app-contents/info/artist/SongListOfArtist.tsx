import { children } from '~/app-contents/api-calls';
import { SchemaDataRowParented } from '~/app-contents/api-calls';
import { SongList } from '~/app-contents/info/Song';
import { QueryKeys } from '~/app-contents/info/query-keys';

import {
	useSchemaPk,
	SchemaDataRow,
	PopCard,
	AnimatedLoadingBar,
	Piece,
} from '@pandazy/jankenstore-client-web';

import { useQuery } from '@tanstack/react-query';
import { Alert } from '@mui/material';

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
	const { data, isLoading } = useQuery({
		queryKey: [QueryKeys.artist, QueryKeys.song, pk ?? ''],
		queryFn: () => children('song', 'artist', [pk ?? ''], 20),
		enabled: !hasError,
	});

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
					</>
				}
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

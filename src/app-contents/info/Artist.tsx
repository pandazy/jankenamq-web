import { SongCells } from './Song';
import { getRandomColor } from './utils';

import {
	byIds,
	children,
	SchemaDataRowParented,
	useSchemaQuery,
} from '../api-calls';

import {
	Piece,
	PopButton,
	PopCardList,
	SchemaDataRow,
	useSchemaPk,
} from '@pandazy/jankenstore-client-web';

import { MusicNote, Person, YouTube } from '@mui/icons-material';
import {
	Alert,
	Avatar,
	ListItemAvatar,
	ListItemText,
	Stack,
	IconButton,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';

function SongListOfArtist({
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
		queryKey: ['song', 'artist', pk ?? ''],
		queryFn: () => children('song', 'artist', pk ?? '', 20),
		enabled: !hasError,
	});

	if (hasError) {
		return <Alert severity="error">{(error as Error).message}</Alert>;
	}

	return (
		<PopCardList
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
			data={data?.records ?? []}
			isLoading={isLoading}
			makeItemContent={(item: SchemaDataRowParented) => (
				<SongCells song={item} from={['artist', artist]} />
			)}
		/>
	);
}

export interface ArtistCellsProps {
	artist: SchemaDataRowParented;
	from?: ['show' | 'song', SchemaDataRowParented];
}

export function ArtistCells({
	artist,
	from,
}: ArtistCellsProps): React.ReactNode {
	const [relatedType, related] = from ?? [];
	return (
		<>
			<Stack direction="row" alignItems="center">
				<ListItemAvatar>
					<Avatar sx={{ backgroundColor: getRandomColor() }}>
						<Person />
					</Avatar>
				</ListItemAvatar>
				<ListItemText
					primary={
						<Piece
							table="artist"
							srcRow={artist as SchemaDataRow}
							col="name"
						/>
					}
				/>
				{relatedType !== 'song' && (
					<PopButton
						buttonProps={{
							variant: 'outlined',
							sx: {
								ml: 10,
							},
							title: 'See related song of the artist',
						}}
						popoverContent={
							<SongListOfArtist artist={artist} table="artist" />
						}
					>
						<MusicNote />
					</PopButton>
				)}
			</Stack>
			{relatedType === 'song' && (
				<IconButton
					component="a"
					href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
						`${artist?.name} ${related?.name}`,
					)}`}
					target="_blank"
					rel="noopener noreferrer"
					title={`Search the song by the artist on YouTube`}
					sx={{ ml: 1 }}
				>
					<Person /> + <MusicNote /> =&gt; <YouTube />
				</IconButton>
			)}
		</>
	);
}

export function ArtistPopCard({
	artistId,
	song,
}: {
	artistId: string;
	song?: SchemaDataRow;
}) {
	const { data, isLoading } = useSchemaQuery(
		{
			table: 'artist',
			fillParent: true,
		},
		{
			queryKey: ['artist', artistId],
			queryFn: () => byIds('artist', [artistId]),
		},
	);
	const artist = data?.records[0];
	if (!artist) {
		return <Alert severity="error">Artist not found</Alert>;
	}
	return (
		<PopCardList
			header={
				<>
					{song ? (
						<>
							<span>Artist of </span>
							<b>
								<Piece table="song" srcRow={song} col="name" />
							</b>
						</>
					) : (
						<>
							<span>Artist</span>
						</>
					)}
				</>
			}
			data={(data?.records ?? []) as SchemaDataRow[]}
			isLoading={isLoading}
			makeItemContent={(item: SchemaDataRow) => (
				<ArtistCells
					artist={item}
					{...(song ? { from: ['song', song] } : {})}
				/>
			)}
		/>
	);
}

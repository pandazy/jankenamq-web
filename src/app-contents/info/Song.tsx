import { getRandomColor } from './utils';
import { peers, SchemaDataRowParented } from '../api-calls';
import { ShowCells } from './Show';
import PopButton from './PopButton';
import { PopCardList } from './PopCard';
import Piece from './Piece';
import { ArtistPopCard } from './Artist';

import { SchemaDataRow } from '@pandazy/jankenstore-client-web';

import { ReactElement } from 'react';
import {
	ListItemText,
	Stack,
	Avatar,
	IconButton,
	Typography,
} from '@mui/material';
import { MusicNote, Movie, YouTube, Person } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';

function ShowList({ song }: { song: SchemaDataRowParented }) {
	const { data, isLoading } = useQuery({
		queryKey: ['show', 'song', song.id],
		queryFn: () =>
			peers(
				'show',
				{
					song: [song.id as string],
				},
				20,
			),
	});
	return (
		<PopCardList
			header={
				<>
					<span>Shows of </span>
					<b>
						<Piece table="song" srcRow={song} col="name" />
					</b>
				</>
			}
			data={data ?? []}
			isLoading={isLoading}
			makeItemContent={(item: SchemaDataRowParented) => (
				<ShowCells
					show={item as SchemaDataRow}
					from={['song', song as SchemaDataRow]}
				/>
			)}
		/>
	);
}

export function SongCells({
	song,
	from,
}: {
	song: SchemaDataRowParented;
	from?: ['artist' | 'show', SchemaDataRowParented];
}): ReactElement {
	const [relatedType, related] = from ?? [];
	const getYoutubeSearchQuery = () =>
		`https://www.youtube.com/results?search_query=${encodeURIComponent(
			`${related?.name} ${song?.name}`,
		)}`;
	return (
		<>
			<Stack direction="row" alignItems="center">
				<Avatar sx={{ backgroundColor: getRandomColor() }}>
					<MusicNote />
				</Avatar>
				<ListItemText
					sx={{ ml: 2 }}
					primary={<Piece table="song" srcRow={song} col="name" />}
				/>
				{relatedType !== 'artist' && <ArtistOfSong song={song} />}

				{relatedType !== 'show' && (
					<PopButton
						buttonProps={{
							variant: 'outlined',
							sx: { ml: 2 },
							title: 'See related shows of the song',
						}}
						popoverContent={<ShowList song={song} />}
					>
						<Movie />
					</PopButton>
				)}
			</Stack>

			{relatedType === 'artist' && (
				<IconButton
					component="a"
					href={getYoutubeSearchQuery()}
					target="_blank"
					rel="noopener noreferrer"
					title={`Search the song by the artist on YouTube`}
					sx={{ ml: 1 }}
				>
					<Person /> + <MusicNote /> =&gt; <YouTube />
				</IconButton>
			)}

			{relatedType === 'show' && (
				<IconButton
					component="a"
					href={getYoutubeSearchQuery()}
					target="_blank"
					rel="noopener noreferrer"
					title={`Search the song of the show on YouTube`}
					sx={{ ml: 1 }}
				>
					<Movie /> + <MusicNote /> =&gt; <YouTube />
				</IconButton>
			)}
		</>
	);
}

export function ArtistOfSong({ song }: { song: SchemaDataRowParented }) {
	const artist = song.$parents?.artist;
	if (!artist) {
		return (
			<PopButton
				buttonProps={{
					variant: 'outlined',
					title: 'Check related artist',
					sx: { ml: 2 },
				}}
				popoverContent={
					<ArtistPopCard
						artistId={song.artist_id as string}
						song={song as SchemaDataRow}
					/>
				}
			>
				<Person />
			</PopButton>
		);
	}
	return (
		<>
			<IconButton
				component="a"
				href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
					artist?.name + ' ' + song.name,
				)}`}
				target="_blank"
				title={`Search the song by the artist on YouTube`}
				rel="noopener noreferrer"
			>
				<Person />
				<Typography variant="caption" sx={{ ml: 1 }}>
					{artist?.name}
				</Typography>
			</IconButton>
		</>
	);
}

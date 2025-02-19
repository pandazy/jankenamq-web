import ArtistOfSong from '~/app-contents/info/song/ArtistOfSong';
import LearningSection from '~/app-contents/info/learning/LearningSection';
import ShowListOfSong from '~/app-contents/info/song/ShowListOfSong';

import { SchemaDataRowParented } from '~/app-contents/api-calls';
import { getRandomColor } from '~/app-contents/utils';
import { DefaultTooltipProps } from '~/app-contents/utils-component';

import { Movie, MusicNote, Person, YouTube } from '@mui/icons-material';

import {
	Piece,
	PopButton,
	SchemaDataRow,
} from '@pandazy/jankenstore-client-web';

import {
	Avatar,
	IconButton,
	ListItemText,
	Stack,
	Tooltip,
} from '@mui/material';

export interface SongRowProps {
	song: SchemaDataRowParented;
	from?: ['artist' | 'show', SchemaDataRowParented];
	learning?: SchemaDataRowParented;
}

export default function SongRow({ song, from, learning }: SongRowProps) {
	const [relatedType, related] = from ?? [];
	const getYoutubeSearchQuery = () =>
		`https://www.youtube.com/results?search_query=${encodeURIComponent(
			`${related?.name} ${song?.name}`,
		)}`;
	return (
		<Stack
			direction="row"
			spacing={2}
			justifyContent="space-between"
			sx={{ width: '100%' }}
		>
			<Stack
				direction="row"
				alignItems="center"
				spacing={2}
				sx={{ py: 2 }}
			>
				<Avatar sx={{ backgroundColor: getRandomColor() }}>
					<MusicNote />
				</Avatar>
				<LearningSection
					song={song as SchemaDataRow}
					learning={learning}
				/>
				<ListItemText
					sx={{ ml: 2 }}
					primary={
						<Piece
							table="song"
							srcRow={song as SchemaDataRow}
							col="name"
						/>
					}
				/>
				{relatedType !== 'artist' && <ArtistOfSong song={song} />}

				{relatedType !== 'show' && (
					<PopButton
						tooltipProps={{
							...DefaultTooltipProps,
							title: (
								<>
									Click to see related <b>shows</b> of the
									song
								</>
							),
						}}
						buttonProps={{
							variant: 'outlined',
							sx: { ml: 2 },
						}}
						popoverContent={<ShowListOfSong song={song} />}
					>
						<Movie />
					</PopButton>
				)}

				{relatedType === 'artist' && (
					<Tooltip
						{...DefaultTooltipProps}
						title={
							<>
								Search the YouTube with the names of the{' '}
								<b>artist</b> and the <b>song</b>
							</>
						}
					>
						<IconButton
							component="a"
							href={getYoutubeSearchQuery()}
							target="_blank"
							rel="noopener noreferrer"
							sx={{ ml: 1 }}
						>
							<Person /> + <MusicNote /> =&gt; <YouTube />
						</IconButton>
					</Tooltip>
				)}

				{relatedType === 'show' && (
					<Tooltip
						{...DefaultTooltipProps}
						title={
							<>
								Search the YouTube with the names of the{' '}
								<b>show</b> and the <b>song</b>
							</>
						}
					>
						<IconButton
							component="a"
							href={getYoutubeSearchQuery()}
							target="_blank"
							rel="noopener noreferrer"
							sx={{ ml: 1 }}
						>
							<Movie /> + <MusicNote /> =&gt; <YouTube />
						</IconButton>
					</Tooltip>
				)}
			</Stack>
		</Stack>
	);
}

import SongListOfArtist from './SongListOfArtist';

import { SchemaDataRowParented } from '~/app-contents/api-calls';
import { getRandomColor } from '~/app-contents/utils';
import { DefaultTooltipProps } from '~/app-contents/utils-component';

import {
	Piece,
	PopButton,
	SchemaDataRow,
} from '@pandazy/jankenstore-client-web';

import {
	Avatar,
	ListItemAvatar,
	ListItemText,
	Stack,
	IconButton,
	Tooltip,
} from '@mui/material';
import { MusicNote, Person, YouTube } from '@mui/icons-material';

export interface ArtistRowProps {
	artist: SchemaDataRowParented;
	from?: ['show' | 'song', SchemaDataRowParented];
}

export default function ArtistRow({
	artist,
	from,
}: ArtistRowProps): React.ReactNode {
	const [relatedType, related] = from ?? [];
	return (
		<>
			<Stack
				direction="row"
				alignItems="center"
				spacing={2}
				sx={{ py: 2 }}
			>
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
						tooltipProps={{
							...DefaultTooltipProps,
							title: (
								<>
									See related <b>song</b> of the artist
								</>
							),
						}}
						buttonProps={{
							variant: 'outlined',
							sx: {
								ml: 10,
							},
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
				<Tooltip
					title={
						<>
							Search the YouTube with the names of the{' '}
							<b>artist</b> and the <b>song</b>
						</>
					}
					{...DefaultTooltipProps}
				>
					<IconButton
						component="a"
						href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
							`${artist?.name} ${related?.name}`,
						)}`}
						target="_blank"
						rel="noopener noreferrer"
						sx={{ ml: 1 }}
					>
						<Person /> + <MusicNote /> =&gt; <YouTube />
					</IconButton>
				</Tooltip>
			)}
		</>
	);
}

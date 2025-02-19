import ArtistPopCard from './ArtistPopCard';

import { DefaultTooltipProps } from '~/app-contents/utils-component';
import { SchemaDataRowParented } from '~/app-contents/api-calls';

import { SchemaDataRow, PopButton } from '@pandazy/jankenstore-client-web';

import { Typography, IconButton, Tooltip } from '@mui/material';
import { Person } from '@mui/icons-material';

export default function ArtistOfSong({
	song,
}: {
	song: SchemaDataRowParented;
}) {
	const artist = song.$parents?.artist;
	if (!artist) {
		return (
			<PopButton
				tooltipProps={{
					...DefaultTooltipProps,
					title: (
						<>
							Click to check related <b>artist</b> of the song
						</>
					),
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
		<Tooltip
			{...DefaultTooltipProps}
			title={
				<>
					Search the YouTube with the names of the <b>artist</b> and
					the <b>song</b>
				</>
			}
		>
			<IconButton
				component="a"
				href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
					artist?.name + ' ' + song.name,
				)}`}
				target="_blank"
				rel="noopener noreferrer"
			>
				<Person />
				<Typography variant="caption" sx={{ ml: 1 }}>
					{artist?.name}
				</Typography>
			</IconButton>
		</Tooltip>
	);
}

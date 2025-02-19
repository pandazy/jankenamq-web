import SongListOfShow from './SongListOfShow';

import { getRandomColor } from '~/app-contents/utils';
import { DefaultTooltipProps } from '~/app-contents/utils-component';

import {
	Piece,
	PopButton,
	SchemaDataRow,
} from '@pandazy/jankenstore-client-web';

import {
	Stack,
	Avatar,
	ListItemText,
	IconButton,
	Tooltip,
} from '@mui/material';
import { Movie, MusicNote, YouTube } from '@mui/icons-material';

import { ReactElement } from 'react';

export interface ShowRowProps {
	show: SchemaDataRow;
	from?: ['artist' | 'song', SchemaDataRow];
}

export default function ShowRow({ show, from }: ShowRowProps): ReactElement {
	const [relatedType, related] = from ?? [];

	return (
		<>
			<Stack direction="row" spacing={2} sx={{ py: 2 }}>
				<Avatar sx={{ backgroundColor: getRandomColor() }}>
					<Movie />
				</Avatar>
				<ListItemText
					primary={<Piece table="show" srcRow={show} col="name" />}
					secondary={
						<Piece table="show" srcRow={show} col="vintage" />
					}
				/>
				{relatedType !== 'song' && (
					<PopButton
						tooltipProps={{
							title: (
								<>
									See <b>songs</b> in the show
								</>
							),
						}}
						buttonProps={{
							variant: 'outlined',
						}}
						popoverContent={<SongListOfShow show={show} />}
					>
						<MusicNote />
					</PopButton>
				)}
			</Stack>
			{relatedType === 'song' && (
				<Tooltip
					{...DefaultTooltipProps}
					title={
						<>
							Search the YouTube with the names of the <b>show</b>{' '}
							and the <b>song</b>
						</>
					}
				>
					<IconButton
						sx={{ ml: 2 }}
						component="a"
						href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
							`${show?.name} ${related?.name}`,
						)}`}
						target="_blank"
						rel="noopener noreferrer"
					>
						<Movie /> + <MusicNote /> =&gt; <YouTube />
					</IconButton>
				</Tooltip>
			)}
		</>
	);
}

import { getRandomColor } from './utils';
import { peers, useSchemaQuery } from '../api-calls';
import { SongList } from './Song';
import { ReactElement } from 'react';

import {
	useSchemaPk,
	SchemaDataRow,
	PopButton,
	Piece,
	PopCard,
	AnimatedLoadingBar,
} from '@pandazy/jankenstore-client-web';
import { Movie, MusicNote, YouTube } from '@mui/icons-material';
import {
	Stack,
	ListItemText,
	Avatar,
	IconButton,
	Tooltip,
} from '@mui/material';

export function ShowCells({ show, from }: ShowCellsProps): ReactElement {
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
					slotProps={{
						tooltip: {
							sx: { whiteSpace: 'nowrap' },
						},
					}}
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

export interface ShowCellsProps {
	show: SchemaDataRow;
	from?: ['artist' | 'song', SchemaDataRow];
}

export function SongListOfShow({ show }: { show: SchemaDataRow }) {
	const { pk: showPk } = useSchemaPk<string>('show', show as SchemaDataRow);
	const { data, isLoading } = useSchemaQuery(
		{
			table: 'song',
			fillParent: true,
		},
		{
			queryKey: ['show', 'song', showPk],
			queryFn: () => peers('song', { show: [showPk ?? ''] }, 20),
		},
	);

	return (
		<>
			<PopCard
				header={
					<>
						<span>Songs in </span>
						<b>
							<Piece table="show" srcRow={show} col="name" />
						</b>
					</>
				}
			>
				<AnimatedLoadingBar isLoading={isLoading} />
				<SongList songs={data?.records ?? []} from={['show', show]} />
			</PopCard>
		</>
	);
}

import { getRandomColor } from './utils';
import PopButton from './PopButton';
import { peers, useSchemaQuery } from '../api-calls';
import { SongCells } from './Song';
import { ReactElement } from 'react';
import { PopCardList } from './PopCard';
import Piece from './Piece';

import { useSchemaPk, SchemaDataRow } from '@pandazy/jankenstore-client-web';

import { Movie, MusicNote, YouTube } from '@mui/icons-material';
import { Stack, ListItemText, Avatar, IconButton, Alert } from '@mui/material';

export function ShowCells({ show, from }: ShowCellsProps): ReactElement {
	const [relatedType, related] = from ?? [];

	return (
		<>
			<Stack direction="row" spacing={2}>
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
						buttonProps={{
							variant: 'outlined',
							title: 'See songs in the show',
						}}
						popoverContent={<SongListOfShow show={show} />}
					>
						<MusicNote />
					</PopButton>
				)}
			</Stack>
			{relatedType === 'song' && (
				<IconButton
					sx={{ ml: 2 }}
					component="a"
					href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
						`${show?.name} ${related?.name}`,
					)}`}
					target="_blank"
					rel="noopener noreferrer"
					title={`Search the song of the show on YouTube`}
				>
					<Movie /> + <MusicNote /> =&gt; <YouTube />
				</IconButton>
			)}
		</>
	);
}

export interface ShowCellsProps {
	show: SchemaDataRow;
	from?: ['artist' | 'song', SchemaDataRow];
}

export function SongListOfShow({ show }: { show: SchemaDataRow }) {
	const { pk, error, hasError } = useSchemaPk('show', show as SchemaDataRow);
	const { data, isLoading } = useSchemaQuery(
		{
			table: 'song',
			fillParent: true,
		},
		{
			queryKey: ['show', 'song', show.id],
			queryFn: () => peers('song', { show: [pk ?? ''] }, 20),
		},
	);
	if (hasError) {
		return <Alert severity="error">{(error as Error).message}</Alert>;
	}
	return (
		<>
			<PopCardList
				header={
					<>
						<span>Songs in </span>
						<b>
							<Piece table="show" srcRow={show} col="name" />
						</b>
					</>
				}
				data={(data ?? []) as SchemaDataRow[]}
				isLoading={isLoading}
				makeItemContent={(item) => (
					<SongCells song={item} from={['show', show]} />
				)}
			/>
		</>
	);
}

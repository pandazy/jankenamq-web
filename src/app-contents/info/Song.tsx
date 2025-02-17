import { peers, SchemaDataRowParented, useLearningMap } from '../api-calls';
import { ShowCells } from './Show';
import { ArtistPopCard } from './Artist';

import {
	DataList,
	Piece,
	PopButton,
	PopCardList,
	SchemaDataRow,
	useSchemaChecks,
} from '@pandazy/jankenstore-client-web';

import { ReactElement } from 'react';
import {
	ListItemText,
	Stack,
	IconButton,
	Typography,
	Chip,
	Button,
	Tooltip,
	Avatar,
} from '@mui/material';
import {
	MusicNote,
	Movie,
	YouTube,
	Person,
	MilitaryTech,
	SchoolOutlined,
	Repeat,
	LocalLibraryTwoTone,
} from '@mui/icons-material';
import { getRandomColor } from './utils';
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
						<Piece
							table="song"
							srcRow={song as SchemaDataRow}
							col="name"
						/>
					</b>
				</>
			}
			data={data?.records ?? []}
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

function LearningSection({
	learning,
}: {
	learning?: SchemaDataRowParented;
}): ReactElement {
	return (
		<>
			{learning && (
				<>
					{Boolean(parseInt(learning.graduated as string)) && (
						<>
							<Tooltip title="You have learned this song">
								<Chip
									icon={
										<SchoolOutlined
											sx={{ fill: 'white' }}
										/>
									}
									label="✔"
									sx={{
										ml: 2,
										backgroundColor: 'success.light',
										color: 'white',
									}}
								/>
							</Tooltip>
							<Tooltip title="Re-learn this song">
								<Button
									variant="outlined"
									size="small"
									sx={{ ml: 2 }}
								>
									<Repeat />
								</Button>
							</Tooltip>
						</>
					)}
					{!parseInt(learning.graduated as string) && (
						<Tooltip
							title={`You are learning this song at level ${
								(learning?.level as number) + 1
							}`}
						>
							<Chip
								icon={<MilitaryTech sx={{ fill: 'white' }} />}
								label={(learning?.level as number) + 1}
								sx={{
									ml: 2,
									backgroundColor: 'primary.light',
									color: 'white',
								}}
							/>
						</Tooltip>
					)}
				</>
			)}
			{!learning && (
				<Tooltip
					title={
						<>
							Click to <b>start learning</b> this song
						</>
					}
				>
					<Button variant="outlined" size="small" sx={{ ml: 2 }}>
						<LocalLibraryTwoTone />
					</Button>
				</Tooltip>
			)}
		</>
	);
}

export function SongCells({
	song,
	from,
	learning,
}: {
	song: SchemaDataRowParented;
	from?: ['artist' | 'show', SchemaDataRowParented];
	learning?: SchemaDataRowParented;
}): ReactElement {
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
				<LearningSection learning={learning} />
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
							slotProps: {
								tooltip: {
									sx: { whiteSpace: 'nowrap' },
								},
							},
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
						popoverContent={<ShowList song={song} />}
					>
						<Movie />
					</PopButton>
				)}
			</Stack>
			<Stack direction="row" alignItems="center">
				{relatedType === 'artist' && (
					<Tooltip
						slotProps={{
							tooltip: {
								sx: { whiteSpace: 'nowrap' },
							},
						}}
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
						slotProps={{
							tooltip: {
								sx: { whiteSpace: 'nowrap' },
							},
						}}
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

export function ArtistOfSong({ song }: { song: SchemaDataRowParented }) {
	const artist = song.$parents?.artist;
	if (!artist) {
		return (
			<PopButton
				tooltipProps={{
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
			slotProps={{
				tooltip: {
					sx: { whiteSpace: 'nowrap' },
				},
			}}
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

export function SongList({
	songs,
	from,
}: {
	songs: SchemaDataRowParented[];
	from?: ['artist' | 'show', SchemaDataRowParented];
}) {
	const { pkField } = useSchemaChecks();
	const songIds = songs.map(
		(song) => song[pkField('song').unwrap()],
	) as string[];
	const { data: learningMap, isLoading: learningIsLoading } =
		useLearningMap(songIds);

	return (
		<>
			<DataList
				data={songs ?? []}
				isLoading={learningIsLoading}
				makeItemContent={(item: SchemaDataRowParented) => (
					<SongCells
						song={item}
						from={from}
						learning={learningMap?.[item.id as string]}
					/>
				)}
			/>
		</>
	);
}

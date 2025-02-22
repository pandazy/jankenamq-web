import { TbdArtist, TbdShow, TbdSong, UncertainItem } from './types';

import { SchemaDataRow } from '@pandazy/jankenstore-client-web';

import {
	List,
	Alert,
	Button,
	Paper,
	Stack,
	Tooltip,
	Typography,
	ListItem,
} from '@mui/material';
import { ReactElement } from 'react';
import ShowRow from '../info/show/ShowRow';
import SongRow from '../info/song/SongRow';
import { ArrowForward } from '@mui/icons-material';
import { ArtistRow } from '../info/Artist';
import AddArtistButton from './AddArtistButton';
import AddShowButton from './AddShowButton';
import AddSongButton from './AddSongButton';
import { useAmqExportContext } from './AmqExportContext';

const getPaperSx = (tbd: boolean) => ({
	p: 1,
	mt: 2,
	backgroundColor: tbd ? 'white' : 'grey.100',
});
const getPaperElevation = (tbd: boolean) => (tbd ? 4 : 1);

export interface UncertainBlockProps {
	item: UncertainItem;
}

export default function UncertainBlock({
	item,
}: {
	item: UncertainItem;
}): ReactElement {
	const { artist, song, show, videoUrl } = item;

	const { setSelectedDuplicateArtistId, getSelectedDuplicateArtistId } =
		useAmqExportContext();

	const selectedArtistId = getSelectedDuplicateArtistId(
		artist?.name as string,
	);

	const selectedArtist =
		artist.$tbd_options &&
		selectedArtistId &&
		(artist.$tbd_options as SchemaDataRow[]).find(
			(option: SchemaDataRow) => option.id === selectedArtistId,
		);

	console.log({
		artist,
		selectedArtistId,
		selectedArtist,
	});

	return (
		<Stack sx={{ width: 'fit-content' }}>
			<Paper
				elevation={getPaperElevation(Boolean(song.$tbd))}
				sx={getPaperSx(Boolean(song.$tbd))}
			>
				{!song.$tbd && (
					<>
						<Typography fontWeight={600} variant="caption">
							Selected
						</Typography>
						<SongRow song={song as SchemaDataRow} />
					</>
				)}
				{song.$tbd && song.$tbd_options && (
					<Stack width="fit-content">
						{(song.$tbd_options as SchemaDataRow[]).length > 0 && (
							<Alert severity="warning">
								(More than 1 namesake songs with the same
								artist, currently unsupported)
							</Alert>
						)}
						{(song.$tbd_options as SchemaDataRow[]).length < 1 && (
							<Stack
								direction="row"
								spacing={2}
								alignItems="center"
							>
								<AddSongButton
									song={song as TbdSong}
									disabled={
										!selectedArtistId &&
										Boolean(artist.$tbd)
									}
									artistId={
										((artist as SchemaDataRow)
											.id as string) ||
										(selectedArtistId as string)
									}
								/>
								{artist.$tbd && !selectedArtistId && (
									<Alert severity="error">
										Please select an artist first
									</Alert>
								)}
							</Stack>
						)}
					</Stack>
				)}
			</Paper>
			<Paper
				elevation={getPaperElevation(
					Boolean(artist.$tbd && !selectedArtist),
				)}
				sx={getPaperSx(Boolean(artist.$tbd && !selectedArtist))}
			>
				{(!artist.$tbd || selectedArtist) && (
					<Stack width="fit-content">
						<Typography fontWeight={600} variant="caption">
							Selected
						</Typography>
						<ArtistRow
							artist={selectedArtist || (artist as SchemaDataRow)}
						/>
					</Stack>
				)}
				{artist.$tbd && artist.$tbd_options && (
					<Stack width="fit-content">
						{(artist.$tbd_options as SchemaDataRow[]).length <
							1 && (
							<AddArtistButton artist={artist as TbdArtist} />
						)}
						{!selectedArtist &&
							(artist.$tbd_options as SchemaDataRow[]).length >
								0 && (
								<List sx={{ width: 'fit-content', mt: 2 }}>
									<Typography fontWeight={600}>
										Pick one of the following artists:
									</Typography>
									{(
										artist.$tbd_options as SchemaDataRow[]
									).map((option) => (
										<ListItem
											key={`artist-option-${option.id}`}
										>
											<Tooltip title="Select this artist">
												<Button
													variant="outlined"
													sx={{
														textTransform: 'none',
														width: 'fit-content',
														mr: 2,
													}}
													onClick={() => {
														setSelectedDuplicateArtistId(
															option?.name as string,
															option.id as string,
														);
													}}
												>
													<ArrowForward />
												</Button>
											</Tooltip>
											<ArtistRow artist={option} />
										</ListItem>
									))}
								</List>
							)}
					</Stack>
				)}
			</Paper>
			<Paper
				elevation={getPaperElevation(Boolean(show?.$tbd))}
				sx={getPaperSx(Boolean(show?.$tbd))}
			>
				{!show?.$tbd && (
					<Stack width="fit-content">
						<Typography fontWeight={600} variant="caption">
							Selected
						</Typography>
						<ShowRow show={show as SchemaDataRow} />
					</Stack>
				)}
				{show?.$tbd && show?.$tbd_options && (
					<Stack width="fit-content">
						{(show?.$tbd_options as SchemaDataRow[]).length < 1 && (
							<AddShowButton show={show as TbdShow} />
						)}
						{(show?.$tbd_options as SchemaDataRow[]).length > 0 && (
							<Stack width="fit-content">
								<Alert severity="warning">
									(More than 1 namesake shows with the same
									vintage, currently unsupported)
								</Alert>
							</Stack>
						)}
					</Stack>
				)}
			</Paper>
			{videoUrl && (
				<Paper elevation={4} sx={getPaperSx(false)}>
					{videoUrl && (
						<video
							style={{ maxHeight: '500px' }}
							src={videoUrl}
							controls
						/>
					)}
				</Paper>
			)}
		</Stack>
	);
}

import UncertainRecords from './import/UncertainRecords';
import CertainRecords from './import/CertainRecords';
import { useAmqExportContext } from './import/AmqExportContext';
import { addPlayHistory, getImportCheck } from './import/api-calls';
import Frame from './Frame';
import amqExportExample from '/AMQ_export_example.png';

import {
	Stack,
	Box,
	Typography,
	Card,
	CardContent,
	CardHeader,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	Alert,
	Divider,
	DialogActions,
	CircularProgress,
	Link,
	Paper,
} from '@mui/material';
import {
	AttachFileTwoTone,
	Block,
	Delete,
	TipsAndUpdatesTwoTone,
} from '@mui/icons-material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ReactElement, useState } from 'react';

import {
	AnimatedLoadingBar,
	SchemaDataRow,
} from '@pandazy/jankenstore-client-web';
import { AmqExportSheet } from './import/types';

function ClearSheetButton(): ReactElement {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const { clearAmqExport } = useAmqExportContext();

	return (
		<>
			<Button
				variant="contained"
				color="warning"
				onClick={() => setIsDialogOpen(true)}
			>
				<Delete /> Clear the current AMQ Export
			</Button>
			<Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
				<DialogTitle>Clear current sheet</DialogTitle>
				<Divider />
				<DialogContent>
					<Stack spacing={2} direction="column" alignItems="start">
						<Alert severity="warning">
							You will lose all unsaved data.
						</Alert>
						Are you sure you want to clear the current AMQ Export?
					</Stack>
				</DialogContent>
				<Divider />
				<DialogActions>
					<Button
						variant="contained"
						color="warning"
						onClick={() => {
							clearAmqExport();
							setIsDialogOpen(false);
						}}
					>
						Clear
					</Button>
					<Button onClick={() => setIsDialogOpen(false)}>
						Cancel
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}

function onLoadFile(
	files: FileList,
	onHandleData: (data: AmqExportSheet) => void,
) {
	const file = files[0];
	const reader = new FileReader();
	reader.onload = (e) => {
		const contents = e.target?.result;
		if (contents) {
			const data = JSON.parse(contents.toString());
			onHandleData(data);
		}
	};
	if (file) {
		reader.readAsText(file);
	}
}

export default function EntryImport(): ReactElement {
	const { updateAmqExport, amqExport, dupArtistIdMap, clearAmqExport } =
		useAmqExportContext();

	console.log({
		dupArtistIdMap,
	});

	const [dragActive, setDragActive] = useState(false);

	const handleDrag = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (e.type === 'dragenter' || e.type === 'dragover') {
			setDragActive(true);
		} else if (e.type === 'dragleave') {
			setDragActive(false);
		}
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(false);

		onLoadFile(e.dataTransfer.files, (data) => {
			updateAmqExport(data);
		});
	};

	const { data: importCheck, isFetching: isLoadingImportCheck } = useQuery({
		queryKey: [
			'import-check',
			amqExport?.songs,
			Object.keys(dupArtistIdMap),
		],
		queryFn: () => getImportCheck(amqExport?.songs || [], dupArtistIdMap),
		enabled: !!amqExport?.songs?.length,
	});

	const { mutate: addHistory, isPending: isLoadingAddHistory } = useMutation({
		mutationFn: (
			straights: {
				show: SchemaDataRow;
				song: SchemaDataRow;
				videoUrl?: string;
			}[],
		) =>
			addPlayHistory(
				straights.map(({ show, song, videoUrl }) => ({
					showId: show.id as string,
					songId: song.id as string,
					...(videoUrl ? { videoUrl } : {}),
				})),
			),
	});

	const uncertainRecords = importCheck?.uncertainRecords ?? [];
	const certainRecords = importCheck?.certainRecords ?? [];

	return (
		<Frame forRoute="import">
			<Typography variant="h3">
				Import AMQ Export records to database
			</Typography>
			<Stack spacing={2} sx={{ mt: 2 }} alignItems="center">
				{(amqExport?.songs?.length ?? 0) > 0 && (
					<Stack direction="row" spacing={2} justifyContent="end">
						<ClearSheetButton />
					</Stack>
				)}
				{(amqExport?.songs?.length ?? 0) === 0 && (
					<>
						<Box
							onDragEnter={handleDrag}
							onDragLeave={handleDrag}
							onDragOver={handleDrag}
							onDrop={handleDrop}
							onClick={() =>
								document.getElementById('file-upload')?.click()
							}
							sx={{
								width: '100%',
								height: 200,
								border: '2px dashed',
								borderColor: dragActive
									? 'primary.main'
									: 'grey.300',
								borderRadius: 1,
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								justifyContent: 'center',
								backgroundColor: dragActive
									? 'action.hover'
									: 'background.paper',
								cursor: 'pointer',
							}}
						>
							<AttachFileTwoTone
								sx={{
									fontSize: 48,
									color: 'primary.main',
									mb: 1,
								}}
							/>
							<Typography>
								Drag and drop files here or click to select
								files
							</Typography>
							<input
								type="file"
								multiple
								onChange={(e) => {
									onLoadFile(
										e.target.files || new FileList(),
										updateAmqExport,
									);
								}}
								style={{ display: 'none' }}
								id="file-upload"
							/>
						</Box>
						<Paper
							sx={{
								p: 2,
								width: 'fit-content',
							}}
						>
							<Link href={amqExportExample} target="_blank">
								<Stack
									direction="column"
									spacing={2}
									alignItems="center"
								>
									<Stack
										direction="row"
										spacing={2}
										alignItems="center"
									>
										<TipsAndUpdatesTwoTone />
										<span>
											Check the image below for how to get
											the files to upload
										</span>
									</Stack>
									<img
										src={amqExportExample}
										alt="AMQ Export Example"
										style={{
											maxHeight: '100px',
											width: 'fit-content',
										}}
									/>
								</Stack>
							</Link>
						</Paper>
					</>
				)}
				<Stack spacing={2}>
					<AnimatedLoadingBar
						isLoading={isLoadingImportCheck || isLoadingAddHistory}
					/>

					{uncertainRecords.length > 0 && (
						<UncertainRecords records={uncertainRecords} />
					)}
					{certainRecords.length > 0 && (
						<Card>
							<CardHeader
								sx={{
									backgroundColor: 'grey.700',
									color: 'white',
								}}
								title={
									<Stack direction="row" alignItems="center">
										<Typography component="div">
											<Stack
												direction="row"
												alignItems="center"
											>
												<CircularProgress
													size={32}
													color="info"
													sx={{
														mr: 1,
														color: 'white',
													}}
													variant="determinate"
													thickness={10}
													value={
														(certainRecords.length /
															(certainRecords.length +
																uncertainRecords.length)) *
														100
													}
												/>
												{uncertainRecords.length > 0 ? (
													<>
														Before going any
														further, address the
														issues above{' '}
													</>
												) : (
													"Let's add these records to Play History!"
												)}
											</Stack>
										</Typography>
										<Button
											variant="contained"
											disabled={
												uncertainRecords.length > 0
											}
											sx={{
												ml: 2,
												backgroundColor: 'grey.100',
												'&:disabled': {
													backgroundColor: 'grey.100',
													color: 'grey.500',
												},
												color: 'grey.900',
											}}
											onClick={() => {
												addHistory(certainRecords);
												clearAmqExport();
											}}
										>
											{uncertainRecords.length > 0 ? (
												<Block />
											) : (
												'OK'
											)}
										</Button>
									</Stack>
								}
							/>
							<CardContent>
								<CertainRecords records={certainRecords} />
							</CardContent>
						</Card>
					)}
				</Stack>
			</Stack>
		</Frame>
	);
}

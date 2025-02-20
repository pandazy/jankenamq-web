import GlobalSearch from './GlobalSearch';
import { useSearchContext } from './SearchContext';

import { ReactElement, useState } from 'react';
import Frame from './Frame';
import {
	Radio,
	FormControlLabel,
	RadioGroup,
	Stack,
	Typography,
	Tooltip,
	Divider,
} from '@mui/material';
import { SearchList } from './info/SearchList';
import { ShowRow } from './info/Show';
import { ArtistRow } from './info/Artist';
import { Movie, MusicNote, Person } from '@mui/icons-material';

export default function EntryHome(): ReactElement {
	const { keyword, exact } = useSearchContext();
	const [sourceType, setSourceType] = useState<'show' | 'song' | 'artist'>(
		'show',
	);
	const [showNameCol, setShowNameCol] = useState<'name' | 'name_romaji'>(
		'name',
	);
	return (
		<div>
			<Frame forRoute="home">
				<Typography variant="h3" component="p">
					Find things
				</Typography>
				<Stack direction="column" sx={{ mt: 2 }}>
					<Stack direction="row" alignItems="center">
						<Typography variant="caption" sx={{ mr: 1 }}>
							Data type:
						</Typography>
						<RadioGroup
							value={sourceType}
							onChange={(e) =>
								setSourceType(
									e.target.value as
										| 'show'
										| 'song'
										| 'artist',
								)
							}
							row
							sx={{ pb: 3, ml: 2 }}
						>
							{[
								{
									value: 'show',
									label: 'Shows',
									icon: (
										<Movie sx={{ width: 48, height: 48 }} />
									),
								},
								{
									value: 'song',
									label: 'Songs',
									icon: (
										<MusicNote
											sx={{ width: 48, height: 48 }}
										/>
									),
								},
								{
									value: 'artist',
									label: 'Artists',
									icon: (
										<Person
											sx={{ width: 48, height: 48 }}
										/>
									),
								},
							].map(({ value, label, icon }, i) => (
								<Tooltip
									title={label}
									id={`${value}-search-radio-data-type-${i}`}
									key={i}
								>
									<FormControlLabel
										value={value}
										control={<Radio />}
										aria-labelledby={`${value}-tooltip-${i}`}
										sx={{
											flexDirection: 'column',
											minHeight: 'fit-content',
										}}
										label={
											<Stack
												direction="row"
												alignItems="center"
											>
												{icon}
											</Stack>
										}
									/>
								</Tooltip>
							))}
						</RadioGroup>
					</Stack>
					{sourceType === 'show' && (
						<>
							<Divider sx={{ my: 2 }} />
							<RadioGroup
								value={showNameCol}
								onChange={(e) =>
									setShowNameCol(
										e.target.value as
											| 'name'
											| 'name_romaji',
									)
								}
								row
							>
								<Stack direction="row" alignItems="center">
									<Typography
										variant="caption"
										sx={{ mr: 1 }}
									>
										Search by:
									</Typography>
									<FormControlLabel
										value="name"
										control={<Radio />}
										label="Name"
									/>
									<FormControlLabel
										value="name_romaji"
										control={<Radio />}
										label="Name (Romaji)"
									/>
								</Stack>
							</RadioGroup>
						</>
					)}
					<GlobalSearch />
					<SearchList
						source={[
							sourceType,
							sourceType === 'show' ? showNameCol : 'name',
						]}
						keyword={keyword}
						exact={exact}
						makeCell={(item) => {
							switch (sourceType) {
								case 'show':
									return <ShowRow show={item} />;
								case 'artist':
									return <ArtistRow artist={item} />;
							}
						}}
					/>
					{/* <SimpleForm<Record<string, string>, string>
						fieldSetup={{
							showName: {
								spec: {
									label: 'Name',
									placeholder: 'Enter name, e.g. John Doe',
								},
								required: true,
							},
							description: {
								spec: { label: 'Description', type: 'text' },
							},
						}}
						mutateOptions={{
							mutationFn: async () => {
								return await new Promise((_, reject) => {
									setTimeout(
										() =>
											reject({
												fieldErrors: {
													showName: 'Name is wrong!',
												},
												message: '',
											}),
										2000,
									);
								});
							},
							onSuccess: (data) => {
								console.log(data);
							},
						}}
					/> */}
				</Stack>
			</Frame>
		</div>
	);
}

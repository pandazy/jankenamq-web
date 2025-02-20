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
	Divider,
	Tabs,
	Tab,
} from '@mui/material';
import { SearchList } from './info/SearchList';
import { ShowRow } from './info/Show';
import { ArtistRow } from './info/Artist';
import { Movie, MusicNote, Person } from '@mui/icons-material';

const DataTypesMap = {
	show: {
		label: 'Shows',
		icon: <Movie sx={{ width: 48, height: 48 }} />,
	},
	song: {
		label: 'Songs',
		icon: <MusicNote sx={{ width: 48, height: 48 }} />,
	},
	artist: {
		label: 'Artists',
		icon: <Person sx={{ width: 48, height: 48 }} />,
	},
};
const DataTypeList: (keyof typeof DataTypesMap)[] = ['show', 'song', 'artist'];

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
						<Tabs
							value={sourceType}
							onChange={(_, value) =>
								setSourceType(
									value as 'show' | 'song' | 'artist',
								)
							}
						>
							{DataTypeList.map((dataType) => (
								<Tab
									value={dataType}
									key={`${dataType}-tab`}
									label={DataTypesMap[dataType].label}
									icon={DataTypesMap[dataType].icon}
								/>
							))}
						</Tabs>
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

import GlobalSearch from './GlobalSearch';
import { useSearchContext } from './SearchContext';

import { ReactElement, useState } from 'react';
import Frame from './Frame';
import { Radio, FormControlLabel, RadioGroup, Stack } from '@mui/material';
import { SearchList } from './info/SearchList';
import { ShowCells } from './info/Show';
import { ArtistCells } from './info/Artist';

export default function EntryHome(): ReactElement {
	const { keyword, exact } = useSearchContext();
	const [sourceType, setSourceType] = useState<'show' | 'song' | 'artist'>(
		'show',
	);
	return (
		<div>
			<Frame forRoute="home">
				<Stack direction="column" sx={{ mt: 2 }}>
					<GlobalSearch />
					<RadioGroup
						value={sourceType}
						onChange={(e) =>
							setSourceType(
								e.target.value as 'show' | 'song' | 'artist',
							)
						}
						row
					>
						<FormControlLabel
							value="show"
							control={<Radio />}
							label="Shows"
						/>
						<FormControlLabel
							value="song"
							control={<Radio />}
							label="Songs"
						/>
						<FormControlLabel
							value="artist"
							control={<Radio />}
							label="Artists"
						/>
					</RadioGroup>
					<SearchList
						source={[sourceType, 'name']}
						keyword={keyword}
						exact={exact}
						makeCell={(item) => {
							switch (sourceType) {
								case 'show':
									return <ShowCells show={item} />;
								case 'artist':
									return <ArtistCells artist={item} />;
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

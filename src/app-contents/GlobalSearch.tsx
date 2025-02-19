import { useSearchContext } from './SearchContext';

import { DebouncedTextField } from '@pandazy/jankenstore-client-web';

import { FormControlLabel, Switch } from '@mui/material';

import { ReactElement } from 'react';

export default function GlobalSearch(): ReactElement {
	const { keyword, setKeyword, exact, setExact } = useSearchContext();

	return (
		<>
			<FormControlLabel
				control={
					<Switch
						checked={exact}
						onChange={(e) => setExact(e.target.checked)}
					/>
				}
				label="Exact Match"
				sx={{ mb: 1, width: 'fit-content' }}
			/>
			<DebouncedTextField
				textFieldProps={{
					label: 'Search',
					variant: 'outlined',
					defaultValue: keyword,
					fullWidth: true,
					sx: {
						mb: 2,
					},
					onChange: (e) => {
						setKeyword(e.target.value ?? '');
					},
				}}
			/>
		</>
	);
}

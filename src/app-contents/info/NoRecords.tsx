import { Inbox } from '@mui/icons-material';
import { Stack, Typography, StackProps } from '@mui/material';
import { ReactElement } from 'react';

const DEFAULT_MESSAGE = 'No records';

export default function NoRecords({
	message,
	stackProps,
}: {
	message?: string;
	stackProps?: StackProps;
}): ReactElement {
	return (
		<Stack
			direction="column"
			alignItems="center"
			sx={{ height: '100%', opacity: 0.5, ...stackProps?.sx }}
			{...stackProps}
		>
			<Inbox
				sx={{
					fontSize: '100px',
				}}
			/>
			<Typography variant="h6">{message ?? DEFAULT_MESSAGE}</Typography>
		</Stack>
	);
}

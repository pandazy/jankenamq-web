import { ReactElement } from 'react';
import { TbdShow } from './types';

import { SchemaDataRow } from '@pandazy/jankenstore-client-web';

import {
	Badge,
	ListItemIcon,
	ListItemText,
	Button,
	Tooltip,
	ButtonProps,
} from '@mui/material';
import { Movie } from '@mui/icons-material';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { addShow } from './api-calls';

export interface AddShowButtonProps extends ButtonProps {
	show: TbdShow;
	onSuccess?: (record: SchemaDataRow) => void;
}

export default function AddShowButton({
	show,
	onSuccess,
	...props
}: AddShowButtonProps): ReactElement {
	const queryClient = useQueryClient();
	const { mutate: doAddShow, isPending } = useMutation({
		mutationFn: () => addShow(show) as Promise<SchemaDataRow>,
		onSuccess: (record) => {
			queryClient.invalidateQueries({
				predicate: (query) =>
					query.queryKey?.includes('show') ||
					query.queryKey?.includes('import-check'),
			});
			onSuccess?.(record);
		},
	});
	return (
		<Tooltip title="Add this show to the database">
			<Button
				variant="outlined"
				sx={{
					textTransform: 'none',
				}}
				disabled={isPending || props.disabled}
				{...props}
				onClick={(e) => {
					doAddShow();
					props.onClick?.(e);
				}}
			>
				<Badge color="warning" badgeContent="New!" sx={{ mt: 2 }}>
					<ListItemIcon>
						<Movie />
					</ListItemIcon>
					<ListItemText primary={show.name} />
				</Badge>
			</Button>
		</Tooltip>
	);
}

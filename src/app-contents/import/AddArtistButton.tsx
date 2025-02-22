import { ReactElement } from 'react';
import { TbdArtist } from './types';

import { SchemaDataRow } from '@pandazy/jankenstore-client-web';

import {
	Badge,
	ListItemIcon,
	ListItemText,
	Button,
	Tooltip,
	ButtonProps,
} from '@mui/material';
import { PersonAdd } from '@mui/icons-material';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { addArtist } from './api-calls';

export interface AddArtistButtonProps extends ButtonProps {
	artist: TbdArtist;
	onSuccess?: (record: SchemaDataRow) => void;
}

export default function AddArtistButton({
	artist,
	onSuccess,
	...props
}: AddArtistButtonProps): ReactElement {
	const queryClient = useQueryClient();
	const { mutate: doAddArtist, isPending } = useMutation({
		mutationFn: () => addArtist(artist) as Promise<SchemaDataRow>,
		onSuccess: (record) => {
			queryClient.invalidateQueries({
				predicate: (query) =>
					query.queryKey?.includes('artist') ||
					query.queryKey?.includes('import-check'),
			});
			onSuccess?.(record);
		},
	});
	return (
		<Tooltip title="Add this artist to the database">
			<Button
				variant="outlined"
				sx={{
					textTransform: 'none',
				}}
				disabled={isPending || props.disabled}
				{...props}
				onClick={(e) => {
					doAddArtist();
					props.onClick?.(e);
				}}
			>
				<Badge color="warning" badgeContent="New!" sx={{ mt: 2 }}>
					<ListItemIcon>
						<PersonAdd />
					</ListItemIcon>
					<ListItemText primary={artist.name} />
				</Badge>
			</Button>
		</Tooltip>
	);
}

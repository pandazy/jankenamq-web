import { ReactElement } from 'react';
import { TbdSong } from './types';

import { SchemaDataRow } from '@pandazy/jankenstore-client-web';

import {
	Badge,
	ListItemIcon,
	ListItemText,
	Button,
	Tooltip,
	ButtonProps,
} from '@mui/material';
import { MusicNote } from '@mui/icons-material';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { addSong } from './api-calls';

export interface AddSongButtonProps extends ButtonProps {
	song: TbdSong;
	artistId: string;
	onSuccess?: (record: SchemaDataRow) => void;
}

export default function AddSongButton({
	song,
	artistId,
	onSuccess,
	...props
}: AddSongButtonProps): ReactElement {
	const queryClient = useQueryClient();
	const { mutate: doAddSong, isPending } = useMutation({
		mutationFn: () => addSong(song, artistId) as Promise<SchemaDataRow>,
		onSuccess: (record) => {
			queryClient.invalidateQueries({
				predicate: (query) =>
					query.queryKey?.includes('song') ||
					query.queryKey?.includes('import-check'),
			});
			onSuccess?.(record);
		},
	});
	return (
		<Tooltip title="Add this song to the database">
			<Button
				variant="outlined"
				sx={{
					textTransform: 'none',
				}}
				disabled={isPending || props.disabled}
				{...props}
				onClick={(e) => {
					doAddSong();
					props.onClick?.(e);
				}}
			>
				<Badge color="warning" badgeContent="New!" sx={{ mt: 2 }}>
					<ListItemIcon>
						<MusicNote />
					</ListItemIcon>
					<ListItemText primary={song.name} />
				</Badge>
			</Button>
		</Tooltip>
	);
}

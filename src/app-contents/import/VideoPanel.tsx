import { Link, Paper, Stack } from '@mui/material';

export default function VideoPanel({ videoUrl }: { videoUrl: string }) {
	return (
		<Paper sx={{ width: 'fit-content' }} elevation={4}>
			<Stack direction="column" spacing={2}>
				<video src={videoUrl} controls style={{ maxWidth: '500px' }} />
				<Link href={videoUrl} target="_blank" rel="noopener noreferrer">
					Open in new tab
				</Link>
			</Stack>
		</Paper>
	);
}

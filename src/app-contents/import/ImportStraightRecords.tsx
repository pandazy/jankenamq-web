import { Paginator } from '~/app-contents/info/Paginator';
import { ShowRow } from '~/app-contents/info/Show';
import { ArtistRow } from '~/app-contents/info/Artist';
import { SongRow } from '~/app-contents/info/Song';
import { useLearningOfSongsMap } from '~/app-contents/info/learning/api-calls';

import {
	AnimatedLoadingBar,
	SchemaDataRow,
} from '@pandazy/jankenstore-client-web';

import { Paper, Stack } from '@mui/material';
import { useState } from 'react';

export default function ImportStraightRecords({
	records,
}: {
	records: {
		show: SchemaDataRow;
		artist: SchemaDataRow;
		song: SchemaDataRow;
		videoUrl?: string;
	}[];
}) {
	const [currentRecordNo, setCurrentRecordNo] = useState(0);
	const { show, artist, song, videoUrl } = records[currentRecordNo];
	const { data: learningOfSongsMap, isFetching } = useLearningOfSongsMap(
		records.map((record) => record.song.id as string),
	);

	return (
		<Stack spacing={2}>
			<AnimatedLoadingBar isLoading={isFetching} />
			<Paginator
				total={records.length}
				page={currentRecordNo}
				turnToPage={(page) => setCurrentRecordNo(page)}
				totalPages={records.length}
			/>
			<Stack spacing={2} sx={{ width: 'fit-content' }}>
				<ShowRow show={show} />
				<SongRow
					song={song}
					learning={learningOfSongsMap?.[song.id as string]}
				/>
				<ArtistRow artist={artist} />
			</Stack>
			{videoUrl && (
				<Paper sx={{ width: 'fit-content' }} elevation={4}>
					<video
						src={videoUrl}
						controls
						style={{ maxWidth: '500px' }}
					/>
				</Paper>
			)}
		</Stack>
	);
}

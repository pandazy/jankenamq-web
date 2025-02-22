import {} from './api-calls';
import { TbdArtist, TbdShow, TbdSong } from './types';
import UncertainBlock from './UncertainBlock';

import { Paginator } from '~/app-contents/info/Paginator';

import { SchemaDataRow } from '@pandazy/jankenstore-client-web';

import { Card, CardContent, CardHeader, Typography } from '@mui/material';
import { ReactElement, useEffect, useState } from 'react';

export type RecordItem = {
	show: TbdShow | SchemaDataRow;
	song: TbdSong | SchemaDataRow;
	artist: TbdArtist | SchemaDataRow;
	videoUrl?: string;
};

export default function UncertainRecords({
	records,
}: {
	records: {
		show: TbdShow | SchemaDataRow;
		song: TbdSong | SchemaDataRow;
		artist: TbdArtist | SchemaDataRow;
		videoUrl?: string;
	}[];
}): ReactElement {
	const [currentRecordNo, setCurrentRecordNo] = useState(0);

	const currentRecord = records[currentRecordNo];

	useEffect(() => {
		setCurrentRecordNo(0);
	}, [records.length]);

	return (
		<Card>
			<CardHeader
				sx={{
					backgroundColor: 'warning.main',
					color: 'white',
				}}
				title={
					<Typography fontWeight={600}>
						Further actions required for records in this card:
					</Typography>
				}
			/>
			<CardContent>
				<Paginator
					total={records?.length}
					page={currentRecordNo}
					turnToPage={(page) => setCurrentRecordNo(page)}
					totalPages={records.length}
				/>
				{currentRecord && <UncertainBlock item={currentRecord} />}
			</CardContent>
		</Card>
	);
}

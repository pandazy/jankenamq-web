import {} from './api-calls';
import { TbdArtist, TbdShow, TbdSong } from './types';
import UncertainBlock from './UncertainBlock';

import { Paginator } from '~/app-contents/info/Paginator';

import { SchemaDataRow } from '@pandazy/jankenstore-client-web';

import { Card, CardContent, CardHeader } from '@mui/material';
import { ReactElement, ReactNode, useEffect, useState } from 'react';

export type RecordItem = {
	show: TbdShow | SchemaDataRow;
	song: TbdSong | SchemaDataRow;
	artist: TbdArtist | SchemaDataRow;
	videoUrl?: string;

};

export default function UncertainRecords({
	records,
	title,
}: {
	title?: ReactNode,
	records: RecordItem[];
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
				title={title}
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

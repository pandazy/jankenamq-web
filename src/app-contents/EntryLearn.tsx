import DueLearningList from './info/learning/DueLearningList';
import AllLearningList from './info/learning/AllLearningList';
import Frame from './Frame';

import { Tab, Tabs, Typography } from '@mui/material';

import { ReactElement, useState } from 'react';
import { Alarm, Schedule } from '@mui/icons-material';

export default function EntryLearn(): ReactElement {
	const [tab, setTab] = useState<'due' | 'all'>('due');
	return (
		<Frame forRoute="learn">
			<Typography variant="h2">Learning songs</Typography>
			<Tabs value={tab} onChange={(_, value) => setTab(value)}>
				<Tab
					icon={<Alarm color="warning" />}
					value="due"
					label={
						<Typography color="warning" variant="caption">
							Due
						</Typography>
					}
				/>
				<Tab icon={<Schedule />} value="all" label="All" />
			</Tabs>
			{tab === 'due' && <DueLearningList />}
			{tab === 'all' && <AllLearningList />}
		</Frame>
	);
}

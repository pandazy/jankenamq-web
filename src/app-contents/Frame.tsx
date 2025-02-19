import { RouteType, RouteConf } from './route-conf';
import { learningSummary } from './info/learning/api-calls';
import { QueryKeys } from './info/query-keys';

import { AnimatedLoadingBar, AvatarNav } from '@pandazy/jankenstore-client-web';

import { Badge, BadgeProps, Box, Stack, Tooltip } from '@mui/material';
import { Typography } from '@mui/material';
import {
	LocalLibraryTwoTone,
	Movie,
	MusicNote,
	Person,
	SchoolTwoTone,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';

function commonBadgeProps(count: number): Omit<BadgeProps, 'children'> {
	return {
		badgeContent: count,
		color: 'info',
		sx: { p: 0.9 },
		max: 100000,
	};
}

function SummaryBoard() {
	const { data: summary, isLoading } = useQuery({
		queryKey: [QueryKeys.learning, 'summary'],
		queryFn: () => learningSummary(),
	});

	return (
		<Stack spacing={2}>
			<AnimatedLoadingBar isLoading={isLoading} />
			<Stack direction="row" spacing={2}>
				<Tooltip
					title={
						<>
							Total <b>shows</b> that have been added
						</>
					}
				>
					<Badge {...commonBadgeProps(summary?.totalShows ?? 0)}>
						<Movie />
					</Badge>
				</Tooltip>
				<Tooltip
					title={
						<>
							Total <b>songs</b> that have been added
						</>
					}
				>
					<Badge {...commonBadgeProps(summary?.totalSongs ?? 0)}>
						<MusicNote />
					</Badge>
				</Tooltip>
				<Tooltip
					title={
						<>
							Total <b>artists</b> that have been added
						</>
					}
				>
					<Badge {...commonBadgeProps(summary?.totalArtists ?? 0)}>
						<Person />
					</Badge>
				</Tooltip>
				<Tooltip
					title={
						<>
							Total songs that are <b>currently learning</b>
						</>
					}
				>
					<Badge
						{...commonBadgeProps(summary?.totalLearningSongs ?? 0)}
					>
						<LocalLibraryTwoTone color="warning" />
					</Badge>
				</Tooltip>
				<Tooltip
					title={
						<>
							Total songs that have <b>finished learning</b>
						</>
					}
				>
					<Badge
						{...commonBadgeProps(summary?.totalGraduatedSongs ?? 0)}
					>
						<SchoolTwoTone color="success" />
					</Badge>
				</Tooltip>
			</Stack>
		</Stack>
	);
}

export interface FrameProps {
	forRoute: RouteType;
	children: React.ReactNode;
}

export default function Frame({
	children,
	forRoute,
}: FrameProps): React.ReactElement {
	return (
		<>
			<Stack
				direction={{ xs: 'column', md: 'row' }}
				justifyContent="space-between"
			>
				<AvatarNav<RouteType>
					current={forRoute}
					avatarSettings={RouteConf.avatarSettings}
				/>
				<SummaryBoard />
			</Stack>
			{children}
			<Box sx={{ p: 20, display: 'flex' }} justifyContent="center">
				<Typography variant="caption">
					Copyright 2025 Jankenamq. All rights reserved.
				</Typography>
			</Box>
		</>
	);
}

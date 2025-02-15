import { AvatarNav } from '@pandazy/jankenstore-client-web';
import { RouteType, RouteConf } from './route-conf';
import { Box } from '@mui/material';
import { Typography } from '@mui/material';

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
			<AvatarNav<RouteType>
				current={forRoute}
				avatarSettings={RouteConf.avatarSettings}
			/>
			{children}
			<Box sx={{ p: 20, display: 'flex' }} justifyContent="center">
				<Typography variant="caption">
					Copyright 2025 Jankenamq. All rights reserved.
				</Typography>
			</Box>
		</>
	);
}

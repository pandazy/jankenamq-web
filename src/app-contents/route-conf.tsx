import { RouteAvatarSettings } from '@pandazy/jankenstore-client-web';

import { MusicNote, Psychology, UploadFile } from '@mui/icons-material';

export type RouteType = 'learn' | 'home' | 'import';

export const RouteConf: {
	avatarSettings: Record<RouteType, RouteAvatarSettings>;
	defaultRoute: RouteType;
} = {
	avatarSettings: {
		home: {
			path: '/',
			avatar: <MusicNote />,
			label: 'Home',
		},
		import: {
			path: '/import',
			avatar: <UploadFile />,
			label: 'Import',
		},
		learn: {
			path: '/learn',
			avatar: <Psychology />,
			label: 'Learn',
		},
	},
	defaultRoute: 'home',
};

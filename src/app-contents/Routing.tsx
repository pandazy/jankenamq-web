import { schema } from './api-calls';
import EntryHome from './EntryHome';
import EntryLearn from './EntryLearn';
import EntryImport from './EntryImport';
import { RouteConf, RouteType } from './route-conf';

import {
	SchemaCheckProvider,
	SchemaFamily,
} from '@pandazy/jankenstore-client-web';

import { useQuery } from '@tanstack/react-query';
import { Alert, Skeleton } from '@mui/material';

import { ReactElement } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const Routes: Record<RouteType, ReactElement> = {
	home: <EntryHome />,
	learn: <EntryLearn />,
	import: <EntryImport />,
};

export default function Routing(): ReactElement {
	const { data: schemaData, isLoading } = useQuery({
		queryKey: ['schema'],
		queryFn: async () => schema(),
	});

	const router = createBrowserRouter([
		{
			path: '/',
			children: Object.entries(Routes).map(([key, element]) => {
				const { path } = RouteConf.avatarSettings[key as RouteType];
				const index = key === RouteConf.defaultRoute;
				return {
					path,
					element,
					index,
				};
			}),
		},
	]);
	return isLoading ? (
		<Skeleton />
	) : (
		<>
			{!schemaData ? (
				<Alert severity="error">Schema not found</Alert>
			) : null}
			<SchemaCheckProvider schemaFamily={schemaData as SchemaFamily}>
				<RouterProvider router={router} />
			</SchemaCheckProvider>
		</>
	);
}

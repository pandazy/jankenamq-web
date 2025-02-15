import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactElement } from 'react';

const QUERY_CLIENT = new QueryClient({
	defaultOptions: {
		queries: {
			retry: false,
		},
	},
});

export interface MainQueryProviderProps {
	children: React.ReactNode;
}

export default function MainQueryProvider({
	children,
}: MainQueryProviderProps): ReactElement {
	return (
		<QueryClientProvider client={QUERY_CLIENT}>
			{children}
		</QueryClientProvider>
	);
}

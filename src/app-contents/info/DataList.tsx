import AnimatedLoadingBar from './AnimatedLoadingBar';
import { all, useSchemaQuery } from '../api-calls';
import { search } from '../api-calls';

import { Divider, List, ListItem } from '@mui/material';
import { ReactElement, ReactNode } from 'react';
import { SchemaDataRow } from '@pandazy/jankenstore-client-web';

export interface DataListProps<T = SchemaDataRow> {
	data: T[];
	makeItemContent: (item: T) => ReactNode;
	isLoading: boolean;
}

export default function DataList<T>({
	data,
	isLoading,
	makeItemContent,
}: DataListProps<T>) {
	return (
		<List sx={{ p: 0 }}>
			<AnimatedLoadingBar isLoading={isLoading} />
			{(data ?? []).map((item, i) => (
				<div key={i}>
					<Divider />
					<ListItem>{makeItemContent(item)}</ListItem>
				</div>
			))}
		</List>
	);
}

export interface SearchListProps {
	source: [string, string];
	keyword: string;
	exact: boolean;
	title?: string;
	makeCell: (item: SchemaDataRow) => ReactNode;
}

export function SearchList({
	source,
	keyword,
	exact,
	makeCell,
}: SearchListProps): ReactElement {
	const [table, col] = source;
	const queryFn = keyword.trim()
		? async () => search({ table, keyword, col, exact })
		: async () => all(table);
	const { data, isLoading } = useSchemaQuery(
		{
			table,
			fillParent: true,
		},
		{
			queryKey: ['search', table, col, keyword, exact],
			queryFn,
		},
	);
	return (
		<DataList
			data={(data ?? []) as SchemaDataRow[]}
			isLoading={isLoading}
			makeItemContent={makeCell}
		/>
	);
}

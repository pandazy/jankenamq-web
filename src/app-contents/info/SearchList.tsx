import { all, useSchemaQuery } from '../api-calls';
import { search } from '../api-calls';

import { ReactElement, ReactNode } from 'react';
import { DataList, SchemaDataRow } from '@pandazy/jankenstore-client-web';
import { SongList } from './Song';

export interface SearchListProps {
	source: [sourceType: string, searchColumn: string];
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
	const [sourceType] = source;
	return (
		<>
			{sourceType === 'song' && <SongList songs={data?.records ?? []} />}
			{sourceType != 'song' && (
				<DataList
					data={(data?.records ?? []) as SchemaDataRow[]}
					isLoading={isLoading}
					makeItemContent={makeCell}
				/>
			)}
		</>
	);
}

import { all, useSchemaQuery, search } from '~/app-contents/api-calls';

import { SongList } from '~/app-contents/info/Song';

import { DataList, SchemaDataRow } from '@pandazy/jankenstore-client-web';

import { ReactElement, ReactNode } from 'react';

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

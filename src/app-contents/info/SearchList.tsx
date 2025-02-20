import { Paginator } from './Paginator';

import { all, useSchemaQuery, search } from '~/app-contents/api-calls';
import { SongList } from '~/app-contents/info/Song';

import { DataList, SchemaDataRow } from '@pandazy/jankenstore-client-web';

import { ReactElement, ReactNode, useState, useEffect } from 'react';
import { usePagination } from '../util-hooks';

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
	const limit = 10;
	const [offset, setOffset] = useState(0);
	const queryFn = keyword.trim()
		? async () => search({ table, keyword, col, exact }, limit, offset)
		: async () => all(table, limit, offset);
	const { data, isLoading } = useSchemaQuery(
		{
			table,
			fillParent: true,
		},
		{
			queryKey: ['search', table, col, keyword, exact, limit, offset],
			queryFn,
		},
	);
	const { page, turnToPage, totalPages } = usePagination(
		data?.total ?? 0,
		setOffset,
		limit,
	);
	const [sourceType] = source;
	useEffect(() => {
		turnToPage(0);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [keyword, table, col, exact, limit]);
	return (
		<>
			{totalPages > 1 && (
				<Paginator
					total={data?.total ?? 0}
					page={page}
					turnToPage={turnToPage}
					totalPages={totalPages}
				/>
			)}
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

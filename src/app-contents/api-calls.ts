import {
	SchemaDataRow,
	SchemaFamily,
	useSchemaChecks,
} from '@pandazy/jankenstore-client-web';

import {
	useQuery,
	UseQueryOptions,
	UseQueryResult,
} from '@tanstack/react-query';

export const ADDR = 'http://localhost:3000';

export const CommonHeaders = {
	'Content-Type': 'application/json',
};

export type RecordsWithTotal<T> = { records: T[]; total: number };

export interface SchemaDataRowParented
	extends Record<
		string,
		string | number | Record<string, SchemaDataRow> | undefined
	> {
	$parents?: Record<string, SchemaDataRow>;
}

export async function schema(): Promise<SchemaFamily> {
	const res = await fetch(`${ADDR}/schema`, {
		method: 'GET',
		headers: CommonHeaders,
	});
	return await res.json();
}

export async function extractParents(
	originalRecords: RecordsWithTotal<SchemaDataRowParented>,
	parentTypes: string[],
	getPkColumn: (table: string) => string,
): Promise<RecordsWithTotal<SchemaDataRowParented>> {
	if (parentTypes.length <= 0) {
		return Promise.resolve(originalRecords);
	}

	const parentedResult = originalRecords.records.map((row) => ({
		...row,
		...{
			$parents: {} as Record<string, SchemaDataRow>,
		},
	})) as SchemaDataRowParented[];
	for (const parentType of parentTypes) {
		const fk = `${parentType}_${getPkColumn(parentType)}`;
		const parentIds = originalRecords.records.map(
			(row) => row[fk] as string,
		);
		const { records: parentRows } = await byIds(parentType, parentIds);
		const parentRowsMap = parentRows.reduce((acc, parent) => {
			acc[parent.id] = parent;
			return acc;
		}, {} as Record<string, SchemaDataRow>);
		parentedResult.forEach((row) => {
			if (row.$parents) {
				const parentId = row[fk] as string;
				row.$parents[parentType] = parentRowsMap[parentId];
			}
		});
	}
	return { records: parentedResult, total: originalRecords.total };
}

export function useSchemaQueryFn(
	basicFetchOptions: {
		table: string;
		fillParent?: boolean;
	},
	query: UseQueryOptions<RecordsWithTotal<SchemaDataRowParented>> = {
		queryKey: ['query', basicFetchOptions.table],
	},
): () => Promise<RecordsWithTotal<SchemaDataRowParented>> {
	const { parentNames, pkField } = useSchemaChecks();
	const { table, fillParent } = basicFetchOptions;
	const parentTypes = parentNames(table);
	return async () => {
		const inputQueryFn = query.queryFn as unknown as () => Promise<
			RecordsWithTotal<SchemaDataRowParented>
		>;
		const results = await inputQueryFn();
		if (!fillParent) {
			return results;
		}
		return extractParents(results, parentTypes, (table) =>
			pkField(table).unwrap(),
		);
	};
}

export function useSchemaQuery(
	basicFetchOptions: {
		table: string;
		fillParent?: boolean;
	},
	query: UseQueryOptions<RecordsWithTotal<SchemaDataRowParented>> = {
		queryKey: ['query', basicFetchOptions.table],
	},
): UseQueryResult<RecordsWithTotal<SchemaDataRowParented>> {
	const { verifyTable } = useSchemaChecks();
	const queryFn = useSchemaQueryFn(basicFetchOptions, query);
	const result = useQuery({
		...query,
		queryFn,
	});
	return verifyTable(basicFetchOptions.table).isErr()
		? ({
				...result,
				isError: true,
				error: verifyTable(basicFetchOptions.table).unwrapErr(),
		  } as UseQueryResult<RecordsWithTotal<SchemaDataRowParented>>)
		: result;
}

export async function all(
	table: string,
	limit = 10,
	offset = 0,
	orderBy = 'created_at desc',
): Promise<RecordsWithTotal<SchemaDataRow>> {
	const url = new URL(`${ADDR}/store_read`);
	Object.entries({
		op: JSON.stringify({
			All: table,
		}),
		limit,
		offset,
		order_by: orderBy,
	}).forEach(([key, value]) => {
		url.searchParams.append(key, value.toString());
	});
	const res = await fetch(url, {
		method: 'GET',
		headers: CommonHeaders,
	});
	return await res.json();
}

export async function byIds(
	table: string,
	keys: string[],
): Promise<{ records: Record<string, string>[]; total: number }> {
	const url = new URL(`${ADDR}/store_read`);
	Object.entries({
		op: JSON.stringify({
			ByPk: { src: table, keys },
		}),
	}).forEach(([key, value]) => {
		url.searchParams.append(key, value.toString());
	});
	const res = await fetch(url, {
		method: 'GET',
		headers: CommonHeaders,
	});
	return await res.json();
}

export interface SearchCriteria {
	table: string;
	col: string;
	keyword: string;
	exact?: boolean;
}

export async function search(
	criteria: SearchCriteria,
	limit = 10,
	offset = 0,
	orderBy = 'created_at desc',
): Promise<RecordsWithTotal<SchemaDataRow>> {
	const url = new URL(`${ADDR}/store_read`);
	Object.entries({
		op: JSON.stringify({
			Search: criteria,
		}),
		limit,
		offset,
		order_by: orderBy,
	}).forEach(([key, value]) => {
		url.searchParams.append(key, value.toString());
	});
	const res = await fetch(url, {
		method: 'GET',
		headers: CommonHeaders,
	});
	return await res.json();
}

export async function children(
	table: string,
	parentTable: string,
	parentIds: string[],
	limit = 10,
	offset = 0,
	orderBy = 'created_at desc',
): Promise<RecordsWithTotal<SchemaDataRow>> {
	const url = new URL(`${ADDR}/store_read`);
	Object.entries({
		op: JSON.stringify({
			Children: { src: table, parents: { [parentTable]: parentIds } },
		}),
		limit,
		offset,
		order_by: orderBy,
	}).forEach(([key, value]) => {
		url.searchParams.append(key, value.toString());
	});
	const res = await fetch(url, {
		method: 'GET',
		headers: CommonHeaders,
	});
	return await res.json();
}

export async function peers(
	sourceTable: string,
	peers: Record<string, string[]>,
	limit = 10,
	offset = 0,
	orderBy = 'created_at desc',
): Promise<{ records: Record<string, string>[]; total: number }> {
	const url = new URL(`${ADDR}/store_read`);
	Object.entries({
		op: JSON.stringify({
			Peers: { src: sourceTable, peers },
		}),
		limit,
		offset,
		order_by: orderBy,
	}).forEach(([key, value]) => {
		url.searchParams.append(key, value.toString());
	});
	const res = await fetch(url, {
		method: 'GET',
		headers: CommonHeaders,
	});
	return await res.json();
}

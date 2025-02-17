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

const ADDR = 'http://localhost:3000';

const CommonHeaders = {
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

export function useSchemaQuery(
	basicFetchOptions: {
		table: string;
		fillParent?: boolean;
	},
	query: UseQueryOptions<RecordsWithTotal<SchemaDataRowParented>> = {
		queryKey: ['query', basicFetchOptions.table],
	},
): UseQueryResult<RecordsWithTotal<SchemaDataRowParented>> {
	const { verifyTable, parentNames, pkField } = useSchemaChecks();
	const { table, fillParent } = basicFetchOptions;
	const verifyTableResult = verifyTable(table);
	const parentTypes = parentNames(table);
	const queryFn = async () => {
		const inputQueryFn = query.queryFn as unknown as () => Promise<
			RecordsWithTotal<SchemaDataRowParented>
		>;
		const originalResult = await inputQueryFn();
		const parentedResult = originalResult.records.map((row) => ({
			...row,
			...(fillParent && parentTypes.length > 0
				? {
						$parents: {} as Record<string, SchemaDataRow>,
				  }
				: {}),
		})) as SchemaDataRowParented[];
		if (fillParent && parentTypes.length > 0) {
			for (const parentType of parentTypes) {
				const fk = `${parentType}_${pkField(parentType).unwrap()}`;
				const parentIds = originalResult.records.map(
					(row) => row[fk] as string,
				);
				const { records: parentRows } = await byIds(
					parentType,
					parentIds,
				);
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
		}
		return { records: parentedResult, total: originalResult.total };
	};
	const result = useQuery({
		...query,
		queryFn,
		enabled: verifyTableResult.isOk(),
	});
	if (!query.queryFn) {
		return {
			isError: true,
			error: new Error('queryFn is required by useSchemaQuery'),
		} as UseQueryResult<RecordsWithTotal<SchemaDataRowParented>>;
	}
	return verifyTableResult.isErr()
		? ({
				...result,
				isError: true,
				error: verifyTableResult.unwrapErr(),
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

export async function allLearnings(
	orderBy: string = 'level,created_at desc',
	limit: number = 10,
	offset: number = 0,
): Promise<RecordsWithTotal<SchemaDataRow>> {
	const url = new URL(`${ADDR}/store_read`);
	Object.entries({
		op: JSON.stringify({
			All: 'learning',
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

export function useLearningMap(
	songIds: string[],
	enabled: boolean = true,
): UseQueryResult<Record<string, SchemaDataRowParented>> {
	const { data: learningList, ...others } = useQuery({
		queryKey: ['learning', 'song', songIds],
		queryFn: () => children('learning', 'song', songIds, 20),
		enabled: enabled && songIds.length > 0,
	});
	const learningMap =
		learningList?.records.reduce((acc, learning) => {
			const existing = acc[learning.song_id];
			if (
				!existing ||
				(existing.graduated &&
					(existing.updated_at ?? 0) < (learning.updated_at ?? 0))
			) {
				acc[learning.song_id] = learning;
			}
			return acc;
		}, {} as Record<string, SchemaDataRowParented>) ?? {};
	return {
		...others,
		data: learningMap,
	} as unknown as UseQueryResult<Record<string, SchemaDataRowParented>>;
}

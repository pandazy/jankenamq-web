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
	query: UseQueryOptions<SchemaDataRowParented[]> = {
		queryKey: ['query', basicFetchOptions.table],
	},
): UseQueryResult<SchemaDataRowParented[]> {
	const { verifyTable, parents: schemaParents, pkField } = useSchemaChecks();
	const { table, fillParent } = basicFetchOptions;
	const verifyTableResult = verifyTable(table);
	const parentTypes = schemaParents(table);
	const queryFn = async () => {
		const inputQueryFn = query.queryFn as unknown as () => Promise<
			SchemaDataRow[]
		>;
		const result = await inputQueryFn();
		const parentedResult = result.map((row) => ({
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
				const parentIds = result.map((row) => row[fk] as string);
				const parentRows = await byIds(parentType, parentIds);
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
		return parentedResult;
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
		} as UseQueryResult<SchemaDataRowParented[]>;
	}
	return verifyTableResult.isErr()
		? ({
				...result,
				isError: true,
				error: verifyTableResult.unwrapErr(),
		  } as UseQueryResult<SchemaDataRowParented[]>)
		: result;
}

export async function all(
	table: string,
	limit = 10,
	offset = 0,
	orderBy = 'created_at desc',
): Promise<Record<string, string>[]> {
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
): Promise<Record<string, string>[]> {
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
): Promise<SchemaDataRow[]> {
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
	parentId: string,
	limit = 10,
	offset = 0,
	orderBy = 'created_at desc',
): Promise<Record<string, string>[]> {
	const url = new URL(`${ADDR}/store_read`);
	Object.entries({
		op: JSON.stringify({
			Children: { src: table, parents: { [parentTable]: [parentId] } },
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
): Promise<Record<string, string>[]> {
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
): Promise<Record<string, string>[]> {
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
	return await fetch(url, {
		method: 'GET',
		headers: CommonHeaders,
	}).then((res) => res.json());
}

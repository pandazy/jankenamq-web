import {
	useSchemaChecks,
	SchemaDataRow,
} from '@pandazy/jankenstore-client-web';
import { Alert } from '@mui/material';
import { SchemaDataRowParented } from '../api-calls';

export default function Piece({
	table,
	srcRow,
	col,
}: {
	table: string;
	srcRow: SchemaDataRowParented;
	col: string;
}): React.ReactNode {
	const { prop } = useSchemaChecks();
	const result = prop(table, col, srcRow as SchemaDataRow);
	if (result.isErr()) {
		return <Alert severity="error">{result.unwrapErr().message}</Alert>;
	}
	return <>{result.unwrap()}</>;
}

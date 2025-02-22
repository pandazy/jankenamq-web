import { SongList } from '~/app-contents/info/Song';
import { peers, useSchemaQuery } from '~/app-contents/api-calls';

import {
	Piece,
	PopCard,
	AnimatedLoadingBar,
	useSchemaPk,
	SchemaDataRow,
} from '@pandazy/jankenstore-client-web';
import { QueryKeys } from '../query-keys';

export default function SongListOfShow({ show }: { show: SchemaDataRow }) {
	const { pk: showPk } = useSchemaPk<string>('show', show as SchemaDataRow);
	const { data, isFetching } = useSchemaQuery(
		{
			table: 'song',
			fillParent: true,
		},
		{
			queryKey: [QueryKeys.show, QueryKeys.song, showPk],
			queryFn: () => peers('song', { show: [showPk ?? ''] }, 20),
		},
	);

	return (
		<>
			<PopCard
				header={
					<>
						<span>Songs in </span>
						<b>
							<Piece table="show" srcRow={show} col="name" />
						</b>
					</>
				}
			>
				<AnimatedLoadingBar isLoading={isFetching} />
				<SongList songs={data?.records ?? []} from={['show', show]} />
			</PopCard>
		</>
	);
}

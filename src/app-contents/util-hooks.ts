import { useState } from 'react';

export function usePagination(
	total: number,
	setOffset: (offset: number) => void,
	limit: number,
) {
	const [page, setPage] = useState(0);
	const totalPages = Math.ceil(total / limit);
	const turnToPage = (page: number) => {
		const nextPage = Math.max(0, Math.min(page, totalPages - 1));
		setOffset(nextPage * limit);
		setPage(nextPage);
	};
	return { page, turnToPage, totalPages };
}

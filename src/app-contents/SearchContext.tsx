import {
	createContext,
	ReactElement,
	ReactNode,
	useContext,
	useState,
} from 'react';

export type KeywordContextType = {
	keyword: string;
	setKeyword: (keyword: string) => void;
	exact: boolean;
	setExact: (exact: boolean) => void;
};

const DefaultKeywordContext: KeywordContextType = {
	keyword: '',
	setKeyword: () => {},
	exact: false,
	setExact: () => {},
};

const KeywordContext = createContext(DefaultKeywordContext);

export default function SearchContextProvider({
	children,
}: {
	children: ReactNode;
}): ReactElement {
	const [keyword, setKeyword] = useState('');
	const [exact, setExact] = useState(false);
	return (
		<KeywordContext.Provider
			value={{ keyword, setKeyword, exact, setExact }}
		>
			{children}
		</KeywordContext.Provider>
	);
}

export function useSearchContext(): KeywordContextType {
	return useContext(KeywordContext);
}

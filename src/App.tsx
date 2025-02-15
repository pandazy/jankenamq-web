import createTheme from '@mui/material/styles/createTheme';
import './App.css';
import MainQueryProvider from './MainQueryProvider.tsx';
import Routing from './app-contents/Routing.tsx';
import { ThemeProvider } from '@mui/material';
import SearchContextProvider from './app-contents/SearchContext.tsx';
const theme = createTheme({
	cssVariables: true,
});

function App() {
	return (
		<MainQueryProvider>
			<ThemeProvider theme={theme}>
				<SearchContextProvider>
					<Routing />
				</SearchContextProvider>
			</ThemeProvider>
		</MainQueryProvider>
	);
}

export default App;

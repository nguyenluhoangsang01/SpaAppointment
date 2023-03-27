import axios from "axios";
import { Suspense, useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import { Route, Routes, useLocation } from "react-router-dom";
import ErrorFallback from "./components/ErrorFallback";
import ScrollToTop from "./components/ScrollToTop";
import Default from "./layouts";
import { selectAuth } from "./redux/slice/auth";
import { routes } from "./utils/constants";
import { convertPathname } from "./utils/helpers";
import Loading from "./views/Loading";

function App() {
	const { accessToken } = useSelector(selectAuth);
	const { pathname } = useLocation();

	axios.defaults.headers.common = `Bearer ${accessToken}`;

	useEffect(() => {
		document.title =
			convertPathname(pathname) !== "" ? convertPathname(pathname) : "Home";
	}, [pathname]);

	return (
		<ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => {}}>
			<Toaster toastOptions={{ duration: 5000 }} />

			<ScrollToTop />

			<Suspense fallback={<Loading />}>
				<Routes>
					<Route element={<Default />}>
						{routes.map((route) => (
							<Route
								key={route.path}
								path={route.path}
								element={route.element}
							/>
						))}
					</Route>
				</Routes>
			</Suspense>
		</ErrorBoundary>
	);
}

export default App;
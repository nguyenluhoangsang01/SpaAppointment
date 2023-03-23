import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import ErrorFallback from "./components/ErrorFallback";
import ScrollToTop from "./components/ScrollToTop";
import { routes } from "./constants";
import Default from "./layouts";
import Loading from "./views/Loading";

function App() {
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
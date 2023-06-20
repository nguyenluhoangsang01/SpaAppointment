import { registerLicense } from "@syncfusion/ej2-base";
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

	// Registering Syncfusion license key
	registerLicense(
		"Mgo+DSMBaFt+QHJqVEZrW05FcUBAXWFKblJ0T2JadVt0ZCQ7a15RRnVfRFxkSX5WdUBrUHpccQ==;Mgo+DSMBPh8sVXJ1S0R+XVFPcUBDWnxLflF1VWJbdV9zflBCcC0sT3RfQF5jT39UdkVmWnpWeXJQRw==;ORg4AjUWIQA/Gnt2VFhiQlBEfVhdXGRWfFN0RnNYfVRxd19DZEwgOX1dQl9gSXhScUVjXHxbeH1dQGE=;MjQ0NDgwMkAzMjMxMmUzMDJlMzBBVlphTy84S09PSTcrd1o0NGlqMDM4dzBQQlJYcnFEdncrQm4xdTZEbXJJPQ==;MjQ0NDgwM0AzMjMxMmUzMDJlMzBFUXNCbnRCWVFSNURoclo4a3c4UGNkMk5hSmJ3NlFUT0MzYng1bXdDMkNjPQ==;NRAiBiAaIQQuGjN/V0d+Xk9FdlRFQmJOYVF2R2BJflx6dVZMZVhBNQtUQF1hSn5Vd0JjWXpddX1URmFd;MjQ0NDgwNUAzMjMxMmUzMDJlMzBqd3QvbEpub2JUQ2tWbERiT1RsRWtYclFndXZEaUovMUI5blo2TVlIVGpzPQ==;MjQ0NDgwNkAzMjMxMmUzMDJlMzBqZGxTbnV3d29SK0ovVy83eDlCemlPdVNvcXQ2OXd5WWZDbXVCdzY3TVJjPQ==;Mgo+DSMBMAY9C3t2VFhiQlBEfVhdXGRWfFN0RnNYfVRxd19DZEwgOX1dQl9gSXhScUVjXHxbeXVQTmE=;MjQ0NDgwOEAzMjMxMmUzMDJlMzBGZlJ0bllMbXVkN3FuZDhXMWc4R1ZPWjVjb1dPTlQvb0NIeEdKS1JnUFkwPQ==;MjQ0NDgwOUAzMjMxMmUzMDJlMzBGM3l1YlpMSTFxYjUrWXpkMERkTlF4UzNhQ0MwMzd5dVRmMnNxNkxoeDZFPQ==;MjQ0NDgxMEAzMjMxMmUzMDJlMzBqd3QvbEpub2JUQ2tWbERiT1RsRWtYclFndXZEaUovMUI5blo2TVlIVGpzPQ=="
	);

	useEffect(() => {
		document.title =
			convertPathname(pathname) !== ""
				? convertPathname(
						pathname.split("/").length > 1
							? pathname.split("/")[2] || pathname.split("/")[1]
							: pathname
				  )
				: "Home";
	}, [pathname]);

	return (
		<ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => {}}>
			<Toaster toastOptions={{ duration: 5000 }} position="top-right" />

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
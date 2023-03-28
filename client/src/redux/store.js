import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
	FLUSH,
	PAUSE,
	PERSIST,
	persistReducer,
	persistStore,
	PURGE,
	REGISTER,
	REHYDRATE
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./slice/auth";

const rootPersistConfig = {
	key: "root",
	storage,
};
const authPersistConfig = {
	key: "auth",
	storage,
};

const rootReducer = combineReducers({
	auth: persistReducer(authPersistConfig, authReducer),
});
const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoreActions: [
					FLUSH,
					PAUSE,
					PERSIST,
					persistStore,
					PURGE,
					REGISTER,
					REHYDRATE,
				],
			},
		}),
});

export const persistor = persistStore(store);
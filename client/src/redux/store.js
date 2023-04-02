import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
	FLUSH,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER,
	REHYDRATE,
	persistReducer,
	persistStore,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./slice/auth";
import serviceReducer from "./slice/service";
import userReducer from "./slice/user";

const rootPersistConfig = {
	key: "root",
	storage,
};
const authPersistConfig = {
	key: "auth",
	storage,
};
const userPersistConfig = {
	key: "user",
	storage,
};
const servicePersistConfig = {
	key: "service",
	storage,
};

const rootReducer = combineReducers({
	auth: persistReducer(authPersistConfig, authReducer),
	user: persistReducer(userPersistConfig, userReducer),
	service: persistReducer(servicePersistConfig, serviceReducer),
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
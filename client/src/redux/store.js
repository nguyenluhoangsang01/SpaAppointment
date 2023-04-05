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
import giftCardReducer from "./slice/giftCard";
import promotionReducer from "./slice/promotion";
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
const promotionPersistConfig = {
	key: "promotion",
	storage,
};
const giftCardPersistConfig = {
	key: "giftCard",
	storage,
};

const rootReducer = combineReducers({
	auth: persistReducer(authPersistConfig, authReducer),
	user: persistReducer(userPersistConfig, userReducer),
	service: persistReducer(servicePersistConfig, serviceReducer),
	promotion: persistReducer(promotionPersistConfig, promotionReducer),
	giftCard: persistReducer(giftCardPersistConfig, giftCardReducer),
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
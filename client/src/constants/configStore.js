import { createStore } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
const persistConfig = {
  key: "root",
  storage,
};

const initial_state = {
  uservalue: {},
};

function reducer(state = initial_state, action) {
  switch (action.type) {
    case "user":
      return {
        ...state,
        uservalue: action.value.data,
        token: action.value.token,
      };

    default:
      return state;
  }
}

const persistedReducer = persistReducer(persistConfig, reducer);
let store = createStore(persistedReducer);
let persistor = persistStore(store);

export { store, persistor };

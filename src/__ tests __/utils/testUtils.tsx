import React from "react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import { render, RenderOptions } from "@testing-library/react";

const mockStore = configureStore([]);

export const createMockStore = (initialState = {}) => {
  const store = mockStore(initialState);
  store.dispatch = jest.fn();
  return store;
};

export const renderWithProvider = (
  ui: React.ReactElement,
  { store, ...renderOptions }: { store: any } & Omit<RenderOptions, "queries">
) => {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <Provider store={store}>
        <MemoryRouter>{children}</MemoryRouter>
      </Provider>
    );
  }
  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

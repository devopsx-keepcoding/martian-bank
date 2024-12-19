import transactionReducer, { storeTransaction } from "../src/slices/transactionSlice";

describe("transactionSlice", () => {
  const initialState = {
    history: [],
    isLoading: false,
    error: null,
  };

  it("should return the initial state", () => {
    expect(transactionReducer(undefined, {})).toEqual(initialState);
  });

  it("should handle storeTransaction", () => {
    const transactions = [
      { id: 1, amount: 100, type: "deposit" },
      { id: 2, amount: 200, type: "withdrawal" },
    ];

    const action = storeTransaction(transactions);
    const expectedState = {
      ...initialState,
      history: transactions,
    };

    expect(transactionReducer(initialState, action)).toEqual(expectedState);
  });
});

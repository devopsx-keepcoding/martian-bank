// __tests__/transferSlice.test.js
import transferReducer, { createTransfer } from "../src/slices/transferSlice";

describe("transferSlice tests", () => {
  let initialState;

  beforeEach(() => {
    initialState = {
      current_transfer: [],
      isLoading: false,
      error: null,
    };
  });

  test("should handle initial state", () => {
    const result = transferReducer(undefined, { type: undefined });
    expect(result).toEqual(initialState);
  });

  test("should handle createTransfer action", () => {
    const newTransfer = { id: 1, amount: 2000, status: "completed" };
    const action = createTransfer(newTransfer);
    const result = transferReducer(initialState, action);
    expect(result.current_transfer).toEqual(newTransfer);
  });
});

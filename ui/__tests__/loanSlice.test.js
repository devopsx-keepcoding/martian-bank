// __tests__/loanSlice.test.js
import loanReducer, { createLoan, storeLoanHistory } from "../src/slices/loanSlice";

describe("loanSlice tests", () => {
  let initialState;

  beforeEach(() => {
    initialState = {
      applied_loan: [],
      loan_history: [],
      isLoading: false,
      error: null,
    };
  });

  test("should handle initial state", () => {
    const result = loanReducer(undefined, { type: undefined });
    expect(result).toEqual(initialState);
  });

  test("should handle createLoan action", () => {
    const newLoan = { id: 1, amount: 5000, status: "pending" };
    const action = createLoan(newLoan);
    const result = loanReducer(initialState, action);
    expect(result.applied_loan).toEqual(newLoan);
  });

  test("should handle storeLoanHistory action", () => {
    const loanHistory = [
      { id: 1, amount: 5000, status: "approved" },
      { id: 2, amount: 3000, status: "rejected" },
    ];
    const action = storeLoanHistory(loanHistory);
    const result = loanReducer(initialState, action);
    expect(result.loan_history).toEqual(loanHistory);
  });
});

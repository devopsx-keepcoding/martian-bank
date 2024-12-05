import ApiUrls from '../src/slices/apiUrls';

describe('ApiUrls', () => {
  it('should define VITE_USERS_URL correctly', () => {
    expect(ApiUrls.VITE_USERS_URL).toBe('http://localhost:8000/api/users/');
  });

  it('should define VITE_ATM_URL correctly', () => {
    expect(ApiUrls.VITE_ATM_URL).toBe('http://localhost:8001/api/atm/');
  });

  it('should define VITE_ACCOUNTS_URL correctly', () => {
    expect(ApiUrls.VITE_ACCOUNTS_URL).toBe('http://127.0.0.1:5000/account/');
  });

  it('should define VITE_TRANSFER_URL correctly', () => {
    expect(ApiUrls.VITE_TRANSFER_URL).toBe('http://127.0.0.1:5000/transaction/');
  });

  it('should define VITE_LOAN_URL correctly', () => {
    expect(ApiUrls.VITE_LOAN_URL).toBe('http://127.0.0.1:5000/loan/');
  });
});

import mongoose from 'mongoose';
import connectDB from '../config/db.js';

jest.mock('mongoose', () => ({
  connect: jest.fn(),
}));

describe('connectDB', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should connect to local MongoDB when DATABASE_HOST is defined', async () => {
    process.env.DATABASE_HOST = 'localhost';
    await connectDB();
    expect(mongoose.connect).toHaveBeenCalledWith('mongodb://localhost:27017/');
  });

  it('should connect to MongoDB Atlas when DB_URL is defined', async () => {
    delete process.env.DATABASE_HOST;
    process.env.DB_URL = 'mongodb+srv://test.mongodb.net';
    await connectDB();
    expect(mongoose.connect).toHaveBeenCalledWith('mongodb+srv://test.mongodb.net');
  });

  it('should log an error and exit process on connection failure', async () => {
    mongoose.connect.mockImplementationOnce(() => {
      throw new Error('Connection failed');
    });

    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});

    await connectDB();

    expect(mockExit).toHaveBeenCalledWith(1);
    mockExit.mockRestore();
  });
});




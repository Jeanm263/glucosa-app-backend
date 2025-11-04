import { Request, Response } from 'express';

// Mocks
const mockRequest = {} as Request;
const mockResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
  cookie: jest.fn(),
} as unknown as Response;

describe('Auth Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should have test infrastructure working', () => {
    expect(1 + 1).toBe(2);
  });
});
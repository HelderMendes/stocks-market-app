import { getAllUsersForNewsEmail } from '@/lib/actions/user.actions';
import dbConnection from '@/database/mongoose';

// Mock the mongoose connection
jest.mock('@/database/mongoose');

describe('getAllUsersForNewsEmail', () => {
  it('should return filtered users with email and name', async () => {
    const mockUsers = [
      { _id: '1', email: 'john@example.com', name: 'John' },
      { _id: '2', email: null, name: 'NoEmail' },
      { _id: '3', email: 'jane@example.com', name: '' },
    ];

    const mockCollection = {
      find: jest.fn().mockReturnValue({
        toArray: jest.fn().mockResolvedValue(mockUsers),
      }),
    };

    const mockDb = { collection: jest.fn(() => mockCollection) };
    (dbConnection as jest.Mock).mockResolvedValue({
      connection: { db: mockDb },
    });

    const result = await getAllUsersForNewsEmail();

    expect(result).toEqual([
      { id: '1', email: 'john@example.com', name: 'John' },
    ]);
  });

  it('should return an empty array if DB connection fails', async () => {
    (dbConnection as jest.Mock).mockResolvedValue({ connection: { db: null } });

    const result = await getAllUsersForNewsEmail();

    expect(result).toEqual([]);
  });
});

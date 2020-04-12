const { toBeType } = require('jest-tobetype');
const axios = require('axios');

expect.extend({ toBeType });

const baseUrl = process.env.API_URL || 'http://localhost:8080/api';

const testKeys = ['bmw', 'audi', 'toyota', 'suzuki', 'mazda', 'porsche', 'opel', 'bugatti', 'mitsubishi', 'peugeot'];

describe('Jest is up and running', () => {
  it('should test that true === true', () => {
    expect(true).toBe(true)
  })
});

describe('Clear database', () => {
  it('DELETE /all should clear the database', async () => {
    const response = await axios.delete(`${baseUrl}/all`);
    expect(response.data).toEqual('All keys were deleted');
  })
});

describe('Fill the Database', () => {
  it('GET / for 10 keys', async () => {
    const promises = testKeys.map(key => axios.get(`${baseUrl}/?key=${key}`));
    await Promise.all(promises);

    const response = await axios.get(`${baseUrl}/all`);
    expect(response.data).toBeType('array');
    expect(response.data[0]).toEqual(
      expect.objectContaining({ name: 'bmw' })
    )
  });
});

describe('Get value by key', () => {
  it('GET / route by key', async () => {
    const response = await axios.get(`${baseUrl}/?key=${testKeys[0]}`);
    expect(response.data).toBeType('string');
  });
});

describe('Modify data by key', () => {
  const keyToUpdate = testKeys[0];
  const updatedValue = 'vibes';
  it('PUT / route by key', async () => {
    const response = await axios.put(`${baseUrl}/?key=${keyToUpdate}`, { name: updatedValue });
    expect(response.data).toEqual(`Key ${keyToUpdate} was successfully updated`);
  });
  it('GET / route should check updated data', async () => {
    const response = await axios.get(`${baseUrl}/?key=${keyToUpdate}`);
    expect(response.data).toEqual(updatedValue);
  });
});

describe('Add extra key, out of limit', () => {
  it('GET /all route should still contain 10 keys', async () => {
    const response = await axios.get(`${baseUrl}/all`);
    expect(response.data).toBeType('array');
    expect(response.data.length).toEqual(10);
  })
});

describe('Remove key', () => {
  const keyToDelete = testKeys[1];
  it('DELETE / route should delete one key', async () => {
    const response = await axios.delete(`${baseUrl}/?key=${keyToDelete}`);
    expect(response.data).toEqual(`Key ${keyToDelete} was successfully deleted`);
  });
  it('GET /all route should still contain 9 keys', async () => {
    const response = await axios.get(`${baseUrl}/all`);
    expect(response.data).toBeType('array');
    expect(response.data.length).toEqual(9);
  })
});

describe('Remove all keys', () => {
  it('DELETE /all route should delete all keys', async () => {
    const response = await axios.delete(`${baseUrl}/all`);
    expect(response.data).toEqual('All keys were deleted');
  });
  it('GET /all route should still contain 0 keys', async () => {
    const response = await axios.get(`${baseUrl}/all`);
    expect(response.data).toBeType('array');
    expect(response.data.length).toEqual(0);
  })
});
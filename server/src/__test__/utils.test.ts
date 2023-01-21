import { getStarters } from '../utils';

describe('getStarters', () => {
  it('should return an array of length 3', async () => {
    const starters = await getStarters();
    expect(starters.length).toBe(3);
  });
});

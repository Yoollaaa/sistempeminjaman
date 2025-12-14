import { describe, it, expect } from 'vitest';

describe('Simple Test', () => {
  it('should pass basic assertion', () => {
    expect(true).toBe(true);
  });

  it('should add numbers correctly', () => {
    expect(2 + 2).toBe(4);
  });

  it('should check string equality', () => {
    expect('hello').toBe('hello');
  });
});


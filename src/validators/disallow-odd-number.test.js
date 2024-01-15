import { jest } from '@jest/globals';

import { disallowOddNumberValidator } from './disallow-odd-number';

describe('disallowOddNumberValidator', () => {
  /** @type {KaskoPublicService} */
  let kasko;

  beforeEach(() => {
    // @ts-ignore
    kasko = {};
  });

  it('should return error for value `2`', () => {
    const mockValidator = jest.fn(() => disallowOddNumberValidator(kasko)({
      fieldName: 'test_name',
      value: 2,
      args: [],
    }));

    expect(mockValidator()).toEqual({
      disallow_odd_number: true,
    });
  });

  it('should return `null` for value `1`', () => {
    const mockValidator = jest.fn(() => disallowOddNumberValidator(kasko)({
      fieldName: 'test_name',
      value: 1,
      args: [],
    }));

    expect(mockValidator()).toEqual(null);
  });

  it('should return `null` if value is empty', () => {
    const mockValidator = jest.fn(() => disallowOddNumberValidator(kasko)({
      fieldName: 'test_name',
      value: '',
      args: [],
    }));

    expect(mockValidator()).toEqual(null);
  });
});

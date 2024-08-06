import { jest } from '@jest/globals';

import { setAgeFromDobService } from './set-age-from-dob';

jest
  .useFakeTimers()
  .setSystemTime(new Date('2020-01-20'));

describe('setAgeFromDobService', () => {
  /** @type {KaskoPublicService} */
  let kasko;

  beforeEach(() => {
    // @ts-ignore
    kasko = {};

    kasko.dispatchEvent = jest.fn();
    kasko.addEventListener = jest.fn();
    kasko.createDate = jest.fn((value) => new Date(value));
  });

  it('should set age as `20`', () => {
    kasko.addEventListener = jest.fn((name, callback) => callback('2000-01-20'));

    setAgeFromDobService(kasko);

    expect(kasko.dispatchEvent).toHaveBeenCalledWith('set-state-input', { 'data.age': 20 });
  });
});

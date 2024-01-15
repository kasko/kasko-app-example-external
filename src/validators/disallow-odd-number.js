/**
 * @param {KaskoPublicService} kasko
 * @returns {KaskoPluginValidationsModel['validate']}
 */
export function disallowOddNumberValidator(kasko) {
  return ({ fieldName, value, args }) => {
    // Do not validate fields that aren't filled ("required" rule is for that)
    if (value == null || value === '') {
      return null;
    }

    const isEven = Number(value) % 2;

    // When value is odd number, apply validation error `disallow_odd_number`
    if (!isEven) {
      return {
        disallow_odd_number: true,
      };
    }

    return null;
  };
}

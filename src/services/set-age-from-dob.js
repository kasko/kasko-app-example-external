/**
 * @param {KaskoPublicService} kasko
 */
export function setAgeFromDobService(kasko) {
  kasko.addEventListener('state-changed', (dobValue) => {
    const dobDate = kasko.createDate(dobValue);
    const ageDifMs = Date.now() - dobDate.getTime();
    const age = Math.abs(new Date(ageDifMs).getUTCFullYear() - 1970);

    // Set value `input.age`
    kasko.dispatchEvent('set-state-input', { age });
  }, { slice: 'input.dob' });
}

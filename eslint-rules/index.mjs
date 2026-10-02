import assertMethodMustExpect from './assert-method-must-expect.mjs';
import noPlaywrightApiInTest from './no-playwright-api-in-test.mjs';
import testMustCallAssert from './test-must-call-assert.mjs';
import testTagsRequired from './test-tags-required.mjs';

export default {
  meta: { name: 'framework' },
  rules: {
    'assert-method-must-expect': assertMethodMustExpect,
    'no-playwright-api-in-test': noPlaywrightApiInTest,
    'test-must-call-assert': testMustCallAssert,
    'test-tags-required': testTagsRequired,
  },
};

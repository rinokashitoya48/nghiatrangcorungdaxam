import securityRules from '@firebase/eslint-plugin-security-rules';
import * as securityRulesParser from '@firebase/eslint-plugin-security-rules/parser';

export default [
  {
    ignores: ['dist/**/*'],
  },
  {
    files: ['firestore.rules'],
    languageOptions: {
      parser: securityRulesParser,
    },
    plugins: {
      'security-rules': securityRules,
    },
    rules: {
      'security-rules/no-open-reads': 'warn',
      'security-rules/no-open-writes': 'error',
      'security-rules/no-redundant-matches': 'error',
    },
  },
];

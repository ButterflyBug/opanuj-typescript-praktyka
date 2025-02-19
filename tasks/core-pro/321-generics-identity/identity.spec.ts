import { describe, it, expect } from 'vitest';
import { IdentityProcessor, RedditIdentity } from './identity.ts';
import { join } from 'path';
import { getCompilerDiagnostics } from '../../../utils/ts-utils.ts';

describe('IdentityProcessor', () => {
  it('should compile', () => {
    const diagnostics = getCompilerDiagnostics(join(__dirname, './identity.ts'));
    expect(diagnostics).toConfirmCompilation();
  });

  it('should find by id', () => {
    const processor = new IdentityProcessor('reddit');
    const identity = processor.findById('4');
    expect(identity?.userName).toBe('Alex Smith');

    const identity2 = processor.findByUserName('Kate Williams');
    expect(identity2).toBeUndefined();
  });
});

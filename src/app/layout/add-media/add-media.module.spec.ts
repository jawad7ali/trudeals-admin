import { AddMediaModule } from './add-media.module';

describe('AddMediaModule', () => {
  let addMediaModule: AddMediaModule;

  beforeEach(() => {
    addMediaModule = new AddMediaModule();
  });

  it('should create an instance', () => {
    expect(addMediaModule).toBeTruthy();
  });
});

import { AddLocationModule } from './add-location.module';

describe('AddLocationModule', () => {
  let addLocationModule: AddLocationModule;

  beforeEach(() => {
    addLocationModule = new AddLocationModule();
  });

  it('should create an instance', () => {
    expect(addLocationModule).toBeTruthy();
  });
});

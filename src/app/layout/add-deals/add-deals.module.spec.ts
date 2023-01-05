import { AddDealsModule } from './add-deals.module';

describe('AddDealsModule', () => {
  let addDealsModule: AddDealsModule;

  beforeEach(() => {
    addDealsModule = new AddDealsModule();
  });

  it('should create an instance', () => {
    expect(addDealsModule).toBeTruthy();
  });
});

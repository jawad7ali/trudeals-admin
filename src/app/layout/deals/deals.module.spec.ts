import { DealsModule } from './deals.module';

describe('DealsModule', () => {
  let dealsModule: DealsModule;

  beforeEach(() => {
    dealsModule = new DealsModule();
  });

  it('should create an instance', () => {
    expect(dealsModule).toBeTruthy();
  });
});

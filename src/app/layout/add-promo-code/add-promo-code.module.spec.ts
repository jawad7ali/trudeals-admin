import { AddPromoCodeModule } from './add-promo-code.module';

describe('AddPromoCodeModule', () => {
  let addPromoCodeModule: AddPromoCodeModule;

  beforeEach(() => {
    addPromoCodeModule = new AddPromoCodeModule();
  });

  it('should create an instance', () => {
    expect(addPromoCodeModule).toBeTruthy();
  });
});

import { PromoCodeModule } from './promo-code.module';

describe('PromoCodeModule', () => {
  let promoCodeModule: PromoCodeModule;

  beforeEach(() => {
    promoCodeModule = new PromoCodeModule();
  });

  it('should create an instance', () => {
    expect(promoCodeModule).toBeTruthy();
  });
});

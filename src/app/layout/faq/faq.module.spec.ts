import { FAQModule } from './faq.module';

describe('FAQModule', () => {
  let fAQModule: FAQModule;

  beforeEach(() => {
    fAQModule = new FAQModule();
  });

  it('should create an instance', () => {
    expect(fAQModule).toBeTruthy();
  });
});

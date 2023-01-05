import { AddBannerModule } from './add-banner.module';

describe('AddBannerModule', () => {
  let addBannerModule: AddBannerModule;

  beforeEach(() => {
    addBannerModule = new AddBannerModule();
  });

  it('should create an instance', () => {
    expect(addBannerModule).toBeTruthy();
  });
});

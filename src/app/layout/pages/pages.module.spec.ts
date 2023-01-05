import { PagesModule } from './news.module';

describe('PagesModule', () => {
  let newsModule: PagesModule;

  beforeEach(() => {
    newsModule = new PagesModule();
  });

  it('should create an instance', () => {
    expect(newsModule).toBeTruthy();
  });
});

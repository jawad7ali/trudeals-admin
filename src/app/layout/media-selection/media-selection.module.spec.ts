import { MediaSelectionModule } from './media-selection.module';

describe('MediaSelectionModule', () => {
  let mediaSelectionModule: MediaSelectionModule;

  beforeEach(() => {
    mediaSelectionModule = new MediaSelectionModule();
  });

  it('should create an instance', () => {
    expect(mediaSelectionModule).toBeTruthy();
  });
});

import { MemberShipEditModule } from './member-ship-edit.module';

describe('MemberShipEditModule', () => {
  let memberShipEditModule: MemberShipEditModule;

  beforeEach(() => {
    memberShipEditModule = new MemberShipEditModule();
  });

  it('should create an instance', () => {
    expect(memberShipEditModule).toBeTruthy();
  });
});

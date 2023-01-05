import { MemberShipModule } from './member-ship.module';

describe('MemberShipModule', () => {
  let memberShipModule: MemberShipModule;

  beforeEach(() => {
    memberShipModule = new MemberShipModule();
  });

  it('should create an instance', () => {
    expect(memberShipModule).toBeTruthy();
  });
});

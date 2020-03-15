import * as ex from '@excalibur';

describe('A DynamicTree Broadphase', () => {
  let actorA: ex.Actor;
  let actorB: ex.Actor;
  let actorC: ex.Actor;

  beforeEach(() => {
    actorA = new ex.Actor(0, 0, 20, 20);
    const colliderA = actorA.body.collider;
    colliderA.type = ex.CollisionType.Active;
    colliderA.shape = new ex.Circle({
      radius: 10
    });

    actorB = new ex.Actor(20, 0, 20, 20);
    const colliderB = actorB.body.collider;
    colliderB.type = ex.CollisionType.Active;

    colliderB.shape = new ex.Circle({
      radius: 10
    });

    actorC = new ex.Actor(1000, 0, 20, 20);
    const colliderC = actorC.body.collider;
    colliderC.type = ex.CollisionType.Active;

    colliderC.shape = new ex.Circle({
      radius: 10
    });
  });

  it('exists', () => {
    expect(ex.DynamicTreeCollisionBroadphase).toBeDefined();
  });

  it('can be constructed', () => {
    const dt = new ex.DynamicTreeCollisionBroadphase();

    expect(dt).not.toBe(null);
  });

  it('can find collision pairs for actors that are potentially colliding', () => {
    const dt = new ex.DynamicTreeCollisionBroadphase();
    dt.track(actorA.body);
    dt.track(actorB.body);
    dt.track(actorC.body);

    // only should be 1 pair since C is very far away
    const pairs = dt.broadphase([actorA.body, actorB.body, actorC.body], 100);

    expect(pairs.length).toBe(1);
  });
});

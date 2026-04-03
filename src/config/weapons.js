export const WEAPONS = {
  handgun: {
    name: 'Handgun',
    damage: 10,
    headshotDamage: 10,
    fireRate: 400,
    bulletSpeed: 600,
    auto: false,
    laser: false,
    chargeDelay: 0,
  },
  assaultRifle: {
    name: 'Assault Rifle',
    damage: 10,
    headshotDamage: 10,
    fireRate: 120,
    bulletSpeed: 700,
    auto: true,
    laser: false,
    chargeDelay: 0,
  },
  sniperRifle: {
    name: 'Sniper Rifle',
    damage: 33,
    headshotDamage: 100,
    fireRate: 1000,
    bulletSpeed: 1200,
    auto: false,
    laser: true,
    chargeDelay: 300,
  },
};

export const WEAPON_ORDER = ['handgun', 'assaultRifle', 'sniperRifle'];

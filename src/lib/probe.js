// Voyager, built from primitives. The point of the detail is that the craft has to read as a
// machine travelling somewhere, not a flat badge: a dish with real depth and struts, a bus with
// separate bays, finned generators on one boom and an instrument platform on the other.
import * as THREE from 'three';

const ALUMINIUM = () => new THREE.MeshStandardMaterial({ color: 0xc9cfd8, metalness: 0.94, roughness: 0.3 });
const WHITE_DISH = () => new THREE.MeshStandardMaterial({ color: 0xe8ecf2, metalness: 0.36, roughness: 0.52, side: THREE.DoubleSide });
const GOLD = () => new THREE.MeshStandardMaterial({ color: 0xd9a44f, metalness: 1, roughness: 0.22 });
const BLANKET = () => new THREE.MeshStandardMaterial({ color: 0xa8842f, metalness: 0.85, roughness: 0.58 });
const COMPOSITE = () => new THREE.MeshStandardMaterial({ color: 0x1e2228, metalness: 0.5, roughness: 0.66 });
const STRUT = () => new THREE.MeshStandardMaterial({ color: 0x9aa2ad, metalness: 0.9, roughness: 0.38 });

/**
 * Returns { group, dish, boom } where `group` is the whole craft, nose along -Z.
 * The craft is about 34 units across the dish.
 */
export function buildProbe() {
  const g = new THREE.Group();

  // ── High gain antenna ─────────────────────────────────────────────────────
  const R = 12;
  const profile = [];
  for (let i = 0; i <= 22; i++) {
    const u = i / 22;
    const r = u * R;
    profile.push(new THREE.Vector2(r, (r * r) / (4 * 11)));
  }
  const dish = new THREE.Mesh(new THREE.LatheGeometry(profile, 72), WHITE_DISH());
  dish.position.y = 2.2;
  g.add(dish);

  // Rim: a torus so the dish has an edge instead of ending in nothing.
  const rim = new THREE.Mesh(new THREE.TorusGeometry(R, 0.22, 8, 72), ALUMINIUM());
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 2.2 + (R * R) / 44;
  g.add(rim);

  // Ribs on the back of the dish.
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const rib = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.5, R * 0.95), ALUMINIUM());
    rib.position.set(Math.cos(a) * R * 0.5, 1.6, Math.sin(a) * R * 0.5);
    rib.rotation.y = -a;
    g.add(rib);
  }

  // Feed horn on three struts, above the dish.
  const feed = new THREE.Mesh(new THREE.ConeGeometry(0.85, 3.4, 16), ALUMINIUM());
  feed.position.y = 9.6;
  feed.rotation.x = Math.PI;
  g.add(feed);
  const subreflector = new THREE.Mesh(new THREE.SphereGeometry(1.5, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2.2), WHITE_DISH());
  subreflector.position.y = 11.4;
  subreflector.rotation.x = Math.PI;
  g.add(subreflector);
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2 + 0.4;
    const strut = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 11.2, 6), STRUT());
    strut.position.set(Math.cos(a) * R * 0.46, 6.4, Math.sin(a) * R * 0.46);
    strut.lookAt(new THREE.Vector3(0, 11.2, 0));
    strut.rotateX(Math.PI / 2);
    g.add(strut);
  }

  // ── Bus ───────────────────────────────────────────────────────────────────
  const bus = new THREE.Group();
  bus.position.y = -2.6;
  const busBody = new THREE.Mesh(new THREE.CylinderGeometry(4.3, 4.3, 2.4, 10), COMPOSITE());
  bus.add(busBody);
  // Ten bays around the bus, some blanketed in gold foil.
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2 + Math.PI / 10;
    const bay = new THREE.Mesh(new THREE.BoxGeometry(2.5, 2.1, 0.5), i % 3 === 0 ? BLANKET() : ALUMINIUM());
    bay.position.set(Math.cos(a) * 4.35, 0, Math.sin(a) * 4.35);
    bay.rotation.y = -a + Math.PI / 2;
    bus.add(bay);
  }
  const busTop = new THREE.Mesh(new THREE.CylinderGeometry(4.4, 4.4, 0.35, 10), ALUMINIUM());
  busTop.position.y = 1.35; bus.add(busTop);
  const busRing = new THREE.Mesh(new THREE.TorusGeometry(4.45, 0.22, 8, 10), GOLD());
  busRing.rotation.x = Math.PI / 2; busRing.position.y = -1.2; bus.add(busRing);
  const tank = new THREE.Mesh(new THREE.SphereGeometry(2.1, 24, 20), BLANKET());
  tank.position.y = -3.2; bus.add(tank);
  const thruster = new THREE.Mesh(new THREE.ConeGeometry(0.55, 1.3, 12), COMPOSITE());
  thruster.position.set(0, -5.2, 0); bus.add(thruster);
  g.add(bus);

  // ── Generator boom, port side ─────────────────────────────────────────────
  const rtgBoom = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 12, 8), STRUT());
  rtgBoom.rotation.z = Math.PI / 2;
  rtgBoom.position.set(-9.5, -3.4, 0);
  g.add(rtgBoom);
  for (let i = 0; i < 3; i++) {
    const x = -13.2 - i * 3.3;
    const rtg = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.05, 2.8, 14), COMPOSITE());
    rtg.rotation.z = Math.PI / 2;
    rtg.position.set(x, -3.4, 0);
    g.add(rtg);
    // Cooling fins, which is what makes a generator read as a generator.
    for (let k = 0; k < 6; k++) {
      const a = (k / 6) * Math.PI * 2;
      const fin = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.08, 1.5), ALUMINIUM());
      fin.position.set(x, -3.4 + Math.cos(a) * 1.4, Math.sin(a) * 1.4);
      fin.rotation.x = -a;
      g.add(fin);
    }
  }

  // ── Instrument boom, starboard side ───────────────────────────────────────
  const sciBoom = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 13, 8), STRUT());
  sciBoom.rotation.z = Math.PI / 2;
  sciBoom.position.set(10, -3.0, 0);
  g.add(sciBoom);
  const platform = new THREE.Mesh(new THREE.BoxGeometry(2.6, 2.2, 2.4), COMPOSITE());
  platform.position.set(16.6, -3.0, 0);
  g.add(platform);
  // Camera barrels on the scan platform, pointed forward.
  [[0.75, 0.5], [-0.75, -0.4]].forEach(([dy, dz]) => {
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.5, 3.1, 14), ALUMINIUM());
    barrel.rotation.x = Math.PI / 2;
    barrel.position.set(16.6 + dz, -3.0 + dy, -2.2);
    g.add(barrel);
    const lens = new THREE.Mesh(new THREE.CircleGeometry(0.42, 16), new THREE.MeshStandardMaterial({ color: 0x0b0e14, metalness: 1, roughness: 0.1 }));
    lens.position.set(16.6 + dz, -3.0 + dy, -3.76);
    g.add(lens);
  });

  // ── Magnetometer boom ─────────────────────────────────────────────────────
  // The long thin one, angled away so the craft has an asymmetric, real silhouette.
  const magBoom = new THREE.Group();
  const mag = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.13, 58, 6), STRUT());
  mag.position.y = 29;
  magBoom.add(mag);
  for (let i = 1; i <= 3; i++) {
    const sensor = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.7, 0.7), ALUMINIUM());
    sensor.position.y = i * 17;
    magBoom.add(sensor);
  }
  magBoom.position.set(-3.4, -1.5, 3);
  magBoom.rotation.set(0.5, 0, 0.72);
  g.add(magBoom);

  // ── Golden record ─────────────────────────────────────────────────────────
  const record = new THREE.Mesh(new THREE.CylinderGeometry(1.85, 1.85, 0.16, 48), GOLD());
  record.position.set(3.6, -2.6, 4.2);
  record.rotation.set(Math.PI / 2, 0, 0.2);
  g.add(record);
  const recordRim = new THREE.Mesh(new THREE.TorusGeometry(1.85, 0.1, 8, 40), ALUMINIUM());
  recordRim.position.copy(record.position);
  recordRim.rotation.copy(record.rotation);
  g.add(recordRim);

  // ── Antennae ──────────────────────────────────────────────────────────────
  [-1, 1].forEach((side) => {
    const whip = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 40, 6), STRUT());
    whip.position.set(side * 2.2, -4.4, -2);
    whip.rotation.set(-0.85, 0, side * 0.55);
    whip.translateY(20);
    g.add(whip);
  });

  return { group: g, dish, bus, magBoom };
}

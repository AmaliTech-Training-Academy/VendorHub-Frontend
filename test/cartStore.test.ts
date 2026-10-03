import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

type FakeStorage = ReturnType<typeof fakeStorage>;

function fakeStorage(overrides: Partial<Storage> = {}) {
  const data = new Map<string, string>();
  return {
    data,
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => void data.set(k, v),
    removeItem: (k: string) => void data.delete(k),
    ...overrides,
  };
}

/** Reads back what the cart persisted under `key`. */
function readSaved(storage: FakeStorage, key: string) {
  const raw = storage.data.get(key);
  if (raw === undefined) {
    throw new Error(`Nothing saved under ${key}`);
  }
  return JSON.parse(raw) as { state: Record<string, unknown> };
}

const item = { productId: 21, vendorId: "3", name: "Jollof rice", price: 20 };

/** Loads fresh store modules, as after a page reload, logged in as `userId`. */
async function load(userId: number | null, storage: FakeStorage) {
  vi.resetModules();
  vi.stubGlobal("localStorage", storage);
  const { useAuthStore } = await import("../store/useAuthStore");
  useAuthStore.setState({ userId });
  const { useCartStore, CART_STORAGE_KEY } = await import("../store/cartStore");
  return { auth: useAuthStore, cart: useCartStore, KEY: CART_STORAGE_KEY };
}

describe("persisted cart", () => {
  let storage: FakeStorage;

  beforeEach(() => {
    storage = fakeStorage();
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("saves only the items, not the delivery choices", async () => {
    const { cart, KEY } = await load(7, storage);
    cart.getState().addItem(item);
    cart.getState().increaseQuantity(21);
    cart.getState().setDeliveryWindow(8);
    cart.getState().setDeliveryDate("2026-10-12");

    const saved = readSaved(storage, KEY);
    expect(Object.keys(saved.state).sort()).toEqual(["items", "ownerId", "vendorId"]);
    expect(saved.state).toMatchObject({ vendorId: "3", ownerId: 7 });
    expect(saved.state.items).toEqual([{ ...item, quantity: 2 }]);
  });

  it("restores the cart after a reload for the same user", async () => {
    const first = await load(7, storage);
    first.cart.getState().addItem(item);

    const { cart } = await load(7, storage);
    expect(cart.getState().items).toEqual([]);
    expect(cart.getState().hasHydrated).toBe(false);

    await cart.persist.rehydrate();
    expect(cart.getState().hasHydrated).toBe(true);
    expect(cart.getState().vendorId).toBe("3");
    expect(cart.getState().items).toEqual([{ ...item, quantity: 1 }]);
    expect(cart.getState().deliveryDate).toBeNull();
    expect(cart.getState().deliveryWindowId).toBeNull();
  });

  it("does not restore another user's cart", async () => {
    const first = await load(7, storage);
    first.cart.getState().addItem(item);

    const { cart } = await load(8, storage);
    await cart.persist.rehydrate();
    expect(cart.getState().items).toEqual([]);
    expect(cart.getState().hasHydrated).toBe(true);
  });

  it("clears the cart and its saved copy on logout", async () => {
    const { cart, auth, KEY } = await load(7, storage);
    cart.getState().addItem(item);
    auth.getState().logout();

    expect(cart.getState().items).toEqual([]);
    expect(readSaved(storage, KEY).state.items).toEqual([]);
  });

  it("clears the cart when a different user logs in without a reload", async () => {
    const { cart, auth } = await load(7, storage);
    cart.getState().addItem(item);
    auth.setState({ userId: 8 });
    expect(cart.getState().items).toEqual([]);
  });

  it("ignores corrupt, wrongly shaped and old-version saved data", async () => {
    for (const saved of [
      "{not json",
      JSON.stringify({ state: { vendorId: "3", items: [{ bad: true }], ownerId: 7 }, version: 1 }),
      JSON.stringify({ state: { vendorId: "3", items: [], ownerId: 7 }, version: 0 }),
    ]) {
      storage = fakeStorage();
      const { cart, KEY } = await load(7, storage);
      storage.data.set(KEY, saved);
      await cart.persist.rehydrate();
      expect(cart.getState().items).toEqual([]);
      expect(cart.getState().hasHydrated).toBe(true);
    }
  });

  it("keeps working when localStorage throws", async () => {
    const boom = () => {
      throw new Error("blocked");
    };
    const { cart } = await load(7, fakeStorage({ getItem: boom, setItem: boom }));

    expect(() => cart.getState().addItem(item)).not.toThrow();
    expect(cart.getState().items).toHaveLength(1);
    await cart.persist.rehydrate();
    expect(cart.getState().hasHydrated).toBe(true);
  });

  it("forgets the owner when the last item is removed", async () => {
    const { cart, KEY } = await load(7, storage);
    cart.getState().addItem(item);
    cart.getState().removeItem(21);
    expect(readSaved(storage, KEY).state).toMatchObject({
      vendorId: null,
      ownerId: null,
      items: [],
    });
  });
});

import { create } from "zustand";
import roomCleanData from "./assets/roomCleanData.json";

// Initialize item counts to 0 for all items
const initialItemCounts = Object.fromEntries(
    roomCleanData.map((item) => [item.id, 0])
);
// Zustand store
const useRoomCleanCart = create((set, get) => ({
  roomItems: roomCleanData,
  itemCounts: { ...initialItemCounts }, // Track item counts
  deliveryCost: 0,
  setDeliveryCost: (cost) => set({ deliveryCost: cost }),
  supplyCost: 0,
  setSupplyCost: (supplyCost) => set({ supplyCost: supplyCost }),
  deliveryOption: "",
  setDeliveryOption: (option) => set({ deliveryOption: option }),


  rating: "", // Initial value for Note
  setRating: (value) => set({ rating: value }),
  
  supplyOption: "Yes, I have",
  setSupplyOption: (supply) => set({ supplyOption: supply }),

  packageOption: "Basic", // Initial value for
  setPackageOption: (value) => set({ packageOption: value }),

packageCost: 0, // Initial value for prefrenceCost
  setPackageCost: (value) => set({ packageCost: value }),

  date: '', // Initial value for deliveryOption
  setDate: (value) => set({ date: value }),


  note: "", // Initial value for Note
  setNote: (value) => set({ note: value }),

  paymentOption: "Card", // Initial value for paymentOption
  setPaymentOption: (value) => set({ paymentOption: value }),

  addToCart: (itemId) =>
    set((state) => ({
      itemCounts: {
        ...state.itemCounts,
        [itemId]: state.itemCounts[itemId] + 1, // Increment count for the item
      },
    })),
  removeFromCart: (itemId) =>
    set((state) => ({
      itemCounts: {
        ...state.itemCounts,
        [itemId]: Math.max(0, state.itemCounts[itemId] - 1), // Decrement count but not below 0
      },
    })),
  clearCart: () =>
    set({
      itemCounts: { ...initialItemCounts }, // Reset item counts
    }),
  getTotalPrice: () => {
    const state = get(); // Access the current state

    const totalPrice = roomCleanData
      .filter((item) => state.itemCounts[item.id] > 0) // Only consider items with counts > 0
      .reduce((total, item) => {
        const itemTotal = item.price * state.itemCounts[item.id];

        return total + itemTotal;
      }, 0); // Calculate total price based on counts

    return totalPrice;
  },
  // New function to get item counts with titles
  getItemCountsWithTitles: () => {
    const state = get(); // Access the current state

    const itemCountsWithTitles = roomCleanData
      .filter((item) => state.itemCounts[item.id] > 0) // Only consider items with counts > 0
      .map((item) => ({
        title: item.title, // Get the title of the item
        count: state.itemCounts[item.id], // Get the count of the item
      }));

    return itemCountsWithTitles;
  },

   // Updated function to get total item count
   getTotalItemCount: () => {
    const state = get(); // Access the current state

    const totalItemCount = Object.values(state.itemCounts).reduce((total, count) => total + count, 0);

    return totalItemCount;
  },

  serviceTime: '',

  setServiceTime: (when) => {
    if (when === 0) {
      set({ serviceTime: 'N/A' });
    } else {
      const currentDate = new Date();
      const newTime = new Date(currentDate.getTime() + when * 60000); // Convert minutes to milliseconds

      // Format the new time
      const formattedTime = newTime.toLocaleString('default', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      });

      set({ serviceTime: formattedTime });
    }
  },

}));

export default useRoomCleanCart;
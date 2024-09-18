import { create } from "zustand";

const useValetCarWashStore = create((set, get) => ({





  bodyStyle: "Sedan", // Initial value for BodyType
  setBodyStyle: (value) => set({ bodyStyle: value }),

  iconBodyStyle: require("./assets/CarStyleIcons/Sedan.png"), // Initial icon source
  setIconBodyStyle: (value) => set({ iconBodyStyle: value }),

  note: "", // Initial value for Note
  setNote: (value) => set({ note: value }),

  rating: "", // Initial value for Note
  setRating: (value) => set({ rating: value }),



  paymentOption: "Card", // Initial value for paymentOption
  setPaymentOption: (value) => set({ paymentOption: value }),

  deliveryOption: "", // Initial value for deliveryOption
  setDeliveryOption: (value) => set({ deliveryOption: value }),

  date: "", // Initial value for deliveryOption
  setDate: (value) => set({ date: value }),

  prefrenceOption: "Exterior", // Initial value for prefrenceOption
  setPrefrenceOption: (value) => set({ prefrenceOption: value }),

  packageOption: "Basic", // Initial value for
  setPackageOption: (value) => set({ packageOption: value }),

  protectionOption: "No", // Initial value for protection
  setProtectionOption: (value) => set({ protectionOption: value }),

odorRemovalOption: false, // Initial value for
  setOdorRemovalOption: (value) => set({ odorRemovalOption: value }),

paintEnhancmentOption: "", // Initial value for
setPaintEnhancmentOption: (value) => set({ paintEnhancmentOption: value }),


  invisibleWipersOption: "", // Initial value for
  setInvisibleWipersOption: (value) => set({ invisibleWipersOption: value }),

  exfoliWaxOption: "", // Initial value for
  setExfoliWaxOption: (value) => set({ exfoliWaxOption: value }),

  headlightRestorationOption: "", // Initial value for
  setHeadlightRestorationOption: (value) => set({ headlightRestorationOption: value }),

  petHairRemovalOption: "", // Initial value for
  setPetHairRemovalOption: (value) => set({ petHairRemovalOption: value }),

  smallScratchRemovalOption: "", // Initial value for
  setSmallScratchRemovalOption: (value) => set({ smallScratchRemovalOption: value }),

  stainRemovalOption: "", // Initial value for
  setStainRemovalOption: (value) => set({ stainRemovalOption: value }),

  engineBayDetailOption: "", // Initial value for
  setEngineBayDetailOption: (value) => set({ engineBayDetailOption: value }),

  cockpitDetailOption: "", // Initial value for
  setCockpitDetailOption: (value) => set({ cockpitDetailOption: value }),


  deliveryCost: 0, // Initial value for deliveryCost
  setDeliveryCost: (value) => set({ deliveryCost: value }),

  prefrenceCost: 0, // Initial value for prefrenceCost
  setPrefrenceCost: (value) => set({ prefrenceCost: value }),


  invisibleWipersCost: 0, // Initial value for prefrenceCost
  setInvisibleWipersCost: (value) => set({ invisibleWipersCost: value }),

  paintEnhancementCost: 0, // Initial value for prefrenceCost
  setPaintEnhancementCost: (value) => set({ paintEnhancementCost: value }),


  exfoliWaxCost: 0, // Initial value for prefrenceCost
  setExfoliWaxCost: (value) => set({ exfoliWaxCost: value }),

  headlightRestorationCost: 0, // Initial value for prefrenceCost
  setHeadlightRestorationCost: (value) => set({ headlightRestorationCost: value }),

  petHairRemovalCost: 0, // Initial value for prefrenceCost
  setPetHairRemovalCost: (value) => set({ petHairRemovalCost: value }),

  smallScratchRemovalCost: 0, // Initial value for prefrenceCost
  setSmallScratchRemovalCost: (value) => set({ smallScratchRemovalCost: value }),

  odorRemovalCost: 0, // Initial value for prefrenceCost
  setOdorRemovalCost: (value) => set({ odorRemovalCost: value }),

  stainRemovalCost: 0, // Initial value for prefrenceCost
  setStainRemovalCost: (value) => set({ stainRemovalCost: value }),

  smallScratchesCost: 0, // Initial value for prefrenceCost
  setSmallScratchesCost: (value) => set({ smallScratchesCost: value }),


  engineBayDetailCost: 0, // Initial value for prefrenceCost
  setEngineBayDetailCost: (value) => set({ engineBayDetailCost: value }),

  cockpitDetailCost: 0, // Initial value for prefrenceCost
  setCockpitDetailCost: (value) => set({ cockpitDetailCost: value }),

  packageCost: 0, // Initial value for prefrenceCost
  setPackageCost: (value) => set({ packageCost: value }),

  protectionCost: 0, // Initial value for prefrenceCost
  setProtectionCost: (value) => set({ protectionCost: value }),

  bodyStyleCost: 35, // Initial value for bodyStyleCost
  setBodyStyleCost: (value) => set({ bodyStyleCost: value }),

  totalCost: 35, // Initial value for totalCost
  updateTotalCost: (value) => set({ totalCost: value }),

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
export default useValetCarWashStore;
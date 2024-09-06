import { create } from "zustand";

const useAppStore = create((set, get) => ({
  user: "", // Initial value for user
  setUser: (value) => set({ user: value }),

  name: "", // Initial value for name
  setName: (value) => set({ name: value }),

  email: "", // Initial value for emailr
  setEmail: (value) => set({ email: value }),


  phone: "", // Initial value for phone
  setPhone: (value) => set({ phone: value }),

  address: "Winnipeg, MB, Canada", // Initial value for phone
  setAddress: (value) => set({ address: value }),

  indexBottom: 0, // Initial value for index
  setIndexBottom: (value) => set({ indexBottom: value }),

  visible: true, // Initial value for visibility
  setVisible: (value) => set({ visible: value }), // Function to set visibility



  carPlate: "", // Initial value for carPlate
  setCarPlate: (value) => set({ carPlate: value }),

  carBrand: "Mazda", // Initial value for CarBrand
  setCarBrand: (value) => set({ carBrand: value }),

  iconBrand: require("./assets/CarBrandIcons/ford.png"), // Initial icon source
  setIconBrand: (value) => set({ iconBrand: value }),

  bodyStyle: "Sedan", // Initial value for BodyType
  setBodyStyle: (value) => set({ bodyStyle: value }),

  iconBodyStyle: require("./assets/CarStyleIcons/Sedan.png"), // Initial icon source
  setIconBodyStyle: (value) => set({ iconBodyStyle: value }),



  currentColor: "", // Initial value for Color
  setCurrentColor: (value) => set({ currentColor: value }),
}));

export default useAppStore;
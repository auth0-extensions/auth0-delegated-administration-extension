const fakeStore = (state) => {
  return {
    default: () => {},
    subscribe: () => {},
    dispatch: () => {},
    getState: () => {
      return { ...state };
    },
  };
};

export default fakeStore;

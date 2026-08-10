const fakeStore = (state) => {
  return {
    default: () => {},
    subscribe: () => () => {},
    dispatch: () => {},
    getState: () => state,
  };
};

export default fakeStore;

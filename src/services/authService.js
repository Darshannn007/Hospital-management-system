export const loginUser = async (data) => {
  return {
    user: { email: data.email },
    token: "dummy-token",
  };
};
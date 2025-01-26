export const refreshToken = async (
): Promise<boolean> => {

  try {
    const response = await fetch("http://localhost:8081/api/getNewAccessToken", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error during token refresh:", error);
    return false;
  }
};

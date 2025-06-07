export const getToken = (): string | null => {
    return localStorage.getItem("jwtToken");
  };
  
  export const getUserInfo = (): { enrollment_number: string } | null => {
    const token = getToken();
    if (!token) return null;
  
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return { enrollment_number: payload.enrollment_number };
    } catch {
      return null;
    }
  };
  
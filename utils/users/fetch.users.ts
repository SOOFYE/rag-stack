    export const fetchCurrentUser = async () => {
    const res = await fetch('/api/auth/user')
    const { user } = await res.json()
    return user;
  }
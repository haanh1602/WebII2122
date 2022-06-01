export default function authHeader() {
  const user = JSON.parse(localStorage.getItem('user'));

  if (user && user.access) {
    return { Authorization: 'Bearer ' + user.access }; // for Spring Boot back-end
    // return { 'x-access-token': user.accessToken };       // for Node.js Express back-end
    return {};
  }
}

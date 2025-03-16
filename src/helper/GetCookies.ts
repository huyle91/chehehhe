const GetCookies = () => {
  const name = "access_token";
  //lay cookies
  const decodedCookie = document.cookie;
  const cookiesArray = decodedCookie.split(";");
};

export default GetCookies;

const base64 = require("base-64");
const axios = require("axios");
const qs = require("query-string");

const baseUrl = "https://netflix-app.openwrks.com";

const nullOrEmpty = (str) => {
  if (str && str !== "") {
    return false;
  }

  return true;
};

const getAccessToken = async () => {
  const authUrl = "https://netflix-auth.openwrks.com/connect/token";

  const headers = {
    "content-type": "application/x-www-form-urlencoded",
    authorization: `Basic ${base64.encode(
      "applicant:g*8gdw24XX45gsawfDDcsza@e"
    )}`,
  };

  let body = qs.stringify({
    grant_type: "client_credentials",
    scope: "netflix.shows.read",
  });

  return axios
    .post(authUrl, body, { headers })
    .then((response) => {
      const { access_token } = response.data;
      return access_token;
    })
    .catch((err) => console.log("Err"));
};

const fetchShows = async () => {
  const token = await getAccessToken();

  const headers = {
    authorization: `Bearer ${token}`,
  };

  return axios
    .get(`${baseUrl}/v1/shows`, { headers })
    .then((response) => {
      return response.data.data;
    })
    .catch((err) => console.log("Error occurred: ", err));
};

module.exports = { nullOrEmpty, fetchShows };

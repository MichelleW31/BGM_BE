const whiteList = [
  //domains that should be able to access your backend server
  "https://www.yoursite.com",
  "http://127.0.0.1:5500",
  "http://localhost:3500:",
];

const corsOptions = {
  origin: (origin, callback) => {
    //remove origin after development
    if (whiteList.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;

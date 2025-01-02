import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  //Generating a token which lasts for 7 days
  //After expiration the user must login again
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  //Sending the generated token to the user in a cookie
  //specifiacally a httpOnly cookie so it is secure
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, //Millisecond
    httpOnly: true, //prevents XSS attacks cross-site scripting attacts
    sameSite: "strict", //CSRF attacks cross-site request forgery attacks
    secure: process.env.NODE_ENV !== "development",
  });

  return token;
};

import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import { OAuth2Client } from "google-auth-library";
import {
  JWT_SECRET,
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";
import {
  hashRefreshToken,
  verifyRefreshTokenHash,
} from "../utils/authTokens.js";
import { sendPasswordResetEmail } from "../config/email.js";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClient = googleClientId ? new OAuth2Client(googleClientId) : null;

const generateVerificationCode = (length = 8) =>
  crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex")
    .slice(0, length)
    .toUpperCase();

const hashResetCode = (code) => hashRefreshToken(`reset:${String(code || "").trim().toUpperCase()}`);

const sanitizeUser = (user) => {
  const userObj = typeof user.toObject === "function" ? user.toObject() : { ...user };
  delete userObj.password;
  delete userObj.refreshToken;
  delete userObj.passwordResetCode;
  delete userObj.passwordResetExpires;
  return userObj;
};

const issueAuthPayload = async (user) => {
  const token = generateToken(user._id.toString(), user.role || "customer");
  const refreshToken = generateRefreshToken(user._id.toString());
  user.refreshToken = hashRefreshToken(refreshToken);
  await user.save();

  return {
    user: sanitizeUser(user),
    token,
    refreshToken,
  };
};

async function verifyGoogleIdToken(idToken) {
  if (!googleClient || !googleClientId) {
    throw new Error("Google login is not configured on server");
  }

  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: googleClientId,
  });
  return ticket.getPayload();
}

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Missing username or password" });
    }

    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    return res.json(await issueAuthPayload(user));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ message: "Thieu token Google." });
    }

    let payload;
    try {
      payload = await verifyGoogleIdToken(idToken);
    } catch (err) {
      console.error("verifyGoogleIdToken failed", err);
      return res.status(401).json({ message: "Token Google khong hop le." });
    }

    const { email, name, sub } = payload || {};
    if (!email) {
      return res.status(400).json({ message: "Khong lay duoc email tu Google." });
    }

    let user = await User.findOne({ email });

    if (user) {
      if (!user.isEmailVerified) user.isEmailVerified = true;
      if (!user.authProvider) user.authProvider = "local";
      if (!user.googleId && sub) user.googleId = sub;

      return res.json({
        ...(await issueAuthPayload(user)),
        isNew: false,
      });
    }

    const googleSignupToken = jwt.sign(
      {
        email,
        fullname: name || "",
        sub: sub || "",
        type: "google-signup",
      },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    return res.json({
      status: "need_profile",
      email,
      fullname: name || "",
      googleSignupToken,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const register = async (req, res) => {
  try {
    const {
      username,
      password,
      confirmPassword,
      email,
      fullname,
      phoneNumber,
      address,
    } = req.body;

    if (!username || !password || !confirmPassword || !email || !fullname || !phoneNumber || !address) {
      return res.status(400).json({ message: "Vui long dien day du thong tin." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Mat khau va xac nhan mat khau khong khop." });
    }

    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(409).json({ message: "Ten dang nhap da duoc su dung." });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({ message: "Email da duoc su dung." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = new User({
      username,
      fullname,
      email,
      password: hashed,
      role: "customer",
      phoneNumber,
      addresses: [address],
      isEmailVerified: true,
    });

    await user.save();
    return res.status(201).json(await issueAuthPayload(user));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const completeGoogleProfile = async (req, res) => {
  try {
    const {
      googleSignupToken,
      username,
      password,
      confirmPassword,
      fullname,
      phoneNumber,
      address,
    } = req.body;

    if (!googleSignupToken) {
      return res.status(400).json({ message: "Thieu thong tin xac thuc Google." });
    }

    let decoded;
    try {
      decoded = jwt.verify(googleSignupToken, JWT_SECRET);
    } catch {
      return res.status(401).json({ message: "Phien Google da het han hoac khong hop le." });
    }

    if (!decoded || decoded.type !== "google-signup" || !decoded.email) {
      return res.status(400).json({ message: "Du lieu Google khong hop le." });
    }

    const email = decoded.email;
    const googleSub = decoded.sub || "";

    if (!username || !password || !confirmPassword || !fullname || !phoneNumber || !address) {
      return res.status(400).json({ message: "Vui long dien day du thong tin." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Mat khau va xac nhan mat khau khong khop." });
    }

    const existingUserByUsername = await User.findOne({ username });
    if (existingUserByUsername) {
      return res.status(409).json({ message: "Ten dang nhap da duoc su dung." });
    }

    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return res.json(await issueAuthPayload(existingUserByEmail));
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = new User({
      username,
      fullname,
      email,
      password: hashed,
      role: "customer",
      phoneNumber,
      addresses: [address],
      isEmailVerified: true,
      authProvider: "google",
      googleId: googleSub,
    });

    await user.save();
    return res.status(201).json(await issueAuthPayload(user));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const profile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password -refreshToken -passwordResetCode -passwordResetExpires"
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({ user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const adminOnly = (req, res) => {
  return res.json({ message: "Hello admin" });
};

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: "Missing refresh token" });
    }

    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      return res.status(401).json({ message: "Invalid or expired refresh token" });
    }

    const user = await User.findById(payload.id);
    if (!user || !verifyRefreshTokenHash(refreshToken, user.refreshToken)) {
      return res.status(401).json({ message: "Invalid or expired refresh token" });
    }

    return res.json(await issueAuthPayload(user));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const forgotPasswordRequest = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Vui long nhap email." });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        message: "Neu email ton tai, chung toi da gui ma xac thuc.",
      });
    }

    const code = generateVerificationCode(8);
    user.passwordResetCode = hashResetCode(code);
    user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    try {
      await sendPasswordResetEmail(user.email, user.username, code);
    } catch (e) {
      console.error("Send password reset email failed", e);
    }

    return res.json({
      message: "Neu email ton tai, chung toi da gui ma xac thuc.",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const resetPasswordWithCode = async (req, res) => {
  try {
    const { email, code, newPassword, confirmPassword } = req.body;

    if (!email || !code || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "Vui long nhap day du thong tin." });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Mat khau moi va xac nhan khong khop." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Ma xac thuc khong hop le hoac da het han." });
    }

    if (!user.passwordResetCode || !user.passwordResetExpires) {
      return res.status(400).json({
        message: "Khong co ma dat lai mat khau hop le. Vui long yeu cau lai.",
      });
    }

    const now = new Date();
    if (user.passwordResetExpires < now) {
      return res.status(400).json({
        message: "Ma dat lai mat khau da het han. Vui long yeu cau lai.",
      });
    }

    if (user.passwordResetCode !== hashResetCode(code)) {
      return res.status(400).json({ message: "Ma xac thuc khong dung." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(newPassword, salt);

    user.password = hashed;
    user.refreshToken = undefined;
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return res.json({
      message: "Dat lai mat khau thanh cong. Ban co the dang nhap voi mat khau moi.",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export default {
  login,
  googleLogin,
  register,
  completeGoogleProfile,
  profile,
  adminOnly,
  refreshToken,
  forgotPasswordRequest,
  resetPasswordWithCode,
};

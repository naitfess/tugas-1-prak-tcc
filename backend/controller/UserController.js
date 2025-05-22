import User from '../model/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

export const register = async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    // Check if the username already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
    }
    try {
        const user = await User.create({ username, password: hashedPassword });
        res.status(201).json("User created successfully");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const login = async (req, res) => {
    try {
    // Login menggunakan username dan password
    const { username, password } = req.body;

    // Cek apakah username terdaftar
    const user = await User.findOne({
      where: { username: username },
    });

    // Kalo username ada (terdaftar)
    if (user) {
      // Data User itu nanti bakalan dipake buat ngesign token
      // Data user dari sequelize itu harus diubah dulu ke bentuk object
      const userPlain = user.toJSON(); // Konversi ke object

      // Ngecek isi dari userplain (tidak wajib ditulis, cuma buat ngecek saja)
      console.log(userPlain);

      // Disini kita mau mengcopy isi dari variabel userPlain ke variabel baru namanya safeUserData
      // Tapi di sini kita gamau copy semuanya, kita gamau copy password sama refresh_token karena itu sensitif
      const { password: _, refresh_token: __, ...safeUserData } = userPlain;

      // Ngecek apakah password sama kaya yg ada di DB
      const decryptPassword = await bcrypt.compare(password, user.password);

      // Kalau password benar, artinya berhasil login
      if (decryptPassword) {
        // Access token expire selama 30 detik
        const accessToken = jwt.sign(
          safeUserData,
          ACCESS_TOKEN, // Pastikan konsisten dengan verifyToken.js
          { expiresIn: "60s" }
        );

        // Refresh token expire selama 10 menit
        const refreshToken = jwt.sign(
          safeUserData,
          REFRESH_TOKEN, // Pastikan konsisten dengan verifyToken.js
          { expiresIn: "10m" }
        );

        // Update tabel refresh token pada DB
        await User.update(
          { refresh_token: refreshToken },
          {
            where: { id: user.id },
          }
        );

        // Masukkin refresh token ke cookie
        res.cookie("refreshToken", refreshToken, {
          httpOnly: false, // Ngatur cross-site scripting, untuk penggunaan asli aktifkan karena bisa nyegah serangan fetch data dari website "document.cookies"
          sameSite: "none", // Ngatur domain yg request misal kalo strict cuman bisa akses ke link dari dan menuju domain yg sama, lax itu bisa dari domain lain tapi cuman bisa get
          maxAge: 24 * 60 * 60 * 1000, // Ngatur lamanya token disimpan di cookie (dalam satuan ms)
          secure: false, // Ini ngirim cookies cuman bisa dari https, kenapa? nyegah skema MITM di jaringan publik, tapi pas development di false in aja
        });

        // Kirim respons berhasil (200)
        res.status(200).json({
          status: "Success",
          message: "Login Berhasil",
          accessToken,
        });
      } else {
        // Kalau password salah
        const error = new Error("Username atau password salah");
        error.statusCode = 400;
        throw error;
      }
    } else {
      // Kalau password salah
      const error = new Error("Username atau password salah");
      error.statusCode = 400;
      throw error;
    }
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "Error",
      message: error.message,
    });
  }
}

export async function logout(req, res) {
  try {
    // ngambil refresh token di cookie
    const refreshToken = req.cookies.refreshToken;

    // Ngecek ada ga refresh tokennya, kalo ga ada kirim status code 204
    if (!refreshToken) {
      const error = new Error("Refresh token tidak ada");
      error.statusCode = 204;
      throw error;
    }

    // Kalau ada, cari user berdasarkan refresh token tadi
    const user = await User.findOne({
      where: { refresh_token: refreshToken },
    });

    // Kalau user gaada, kirim status code 204
    if (!user.refresh_token) {
      const error = new Error("User tidak ditemukan");
      error.statusCode = 204;
      throw error;
    }

    // Kalau user ketemu (ada), ambil user id
    const userId = user.id;

    // Hapus refresh token dari DB berdasarkan user id tadi
    await User.update(
      { refresh_token: null },
      {
        where: { id: userId },
      }
    );

    // Ngehapus refresh token yg tersimpan di cookie
    res.clearCookie("refreshToken");

    // Kirim respons berhasil (200)
    res.status(200).json({
      status: "Success",
      message: "Logout Berhasil",
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "Error",
      message: error.message,
    });
  }
}
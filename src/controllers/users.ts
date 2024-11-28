import { db } from "@/db/db";
import { RequestHandler } from "express";
import bcrypt from "bcrypt";
export const createUser:RequestHandler = async (req, res) => {
    const {
      email,
      username,
      password,
      firstName,
      lastName,
      phone,
      dob,
      image,
      role,
    } = req.body;
  
    try {
      // Check if user already exists(username, email, phone)
      const existingUserByEmail = await db.user.findUnique({
        where: {
          email,
        },
      });
      const existingUserByPhone = await db.user.findUnique({
        where: {
          phone,
        },
      });
      const existingUserByUsername = await db.user.findUnique({
        where: {
          username,
        },
      });
      if (existingUserByEmail) {
        res.status(401).json({
          error: `Email (${email}) is already taken`,
          data: null,
        });
        return;
      }
      if (existingUserByPhone) {
        res.status(401).json({
          error: `Phone Number (${phone}) is already taken`,
          data: null,
        });
        return;
      }
      if (existingUserByUsername) {
        res.status(401).json({
          error: `Username (${username}) is already taken`,
          data: null,
        });
        return;
      }
      // Hash the password
      const hashedPassword: string = await bcrypt.hash(password, 10);
  
      //Crete user
      const newUser = await db.user.create({
        data: {
          email,
          username,
          password: hashedPassword,
          firstName,
          lastName,
          phone,
          dob,
          role,
          image: image
            ? image
            : "https://i.pinimg.com/736x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg",
        },
      });
      //Modify returned user
      const { password: savedPassword, ...others } = newUser;
  
      res.status(201).json({
        data: others,
        error: null,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: "Something went wrong",
        data: null,
      });
    }
  }
  
  export const getUser:RequestHandler = async (req, res) => {
    try {
      const users = await db.user.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });
      const filteredUser = users.map((user) => {
        const { password, ...others } = user;
        return others;
      });
      res.status(200).json({
        data: filteredUser,
        error: null,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: "Something went wrong",
        data: null,
      });
    }
  }
  
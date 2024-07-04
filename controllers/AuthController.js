import mongoose from 'mongoose';
import UserModel from '../models/UserModel.js';
import { comparePassword, hashPassword } from '../Helper/authHelper.js';
import jwt from 'jsonwebtoken';
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await hashPassword(password);
    const newUser = new UserModel({ name, email, password: hashedPassword });
    await newUser.save();
    res.status(200).send({
      success: true,
      message: 'User created successfully',
      newUser,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'Error in signup',
      error,
    });
  }
};

export const signin = async (req, res) => {
  try {
    const { name, password } = req.body;

    const CheckUser = await UserModel.findOne({ name });

    if (!CheckUser) {
      return res
        .status(404)
        .send({ success: false, message: 'User not found' });
    }
    const ComparePassowrd = await comparePassword(password, CheckUser.password);
    if (!ComparePassowrd) {
      return res
        .status(500)
        .send({ success: false, message: 'Wrong password' });
    }
    const token = jwt.sign({ id: CheckUser._id }, process.env.JWT_SECERET);

    const userData = await UserModel.findById(CheckUser._id).select(
      '-password'
    );

    res
      .cookie('access_token', token, {
        httpOnly: true,
        secure: 'production',
        sameSite: 'lax',
      })
      .status(200)
      .json({ userData, token });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: 'Error in signin',
      error: err,
    });
  }
};

export const googleAuth = async (req, res, next) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECERET);
      res
        .cookie('access_token', token, {
          httpOnly: true,
          secure: 'production',
          sameSite: 'lax',
        })
        .status(200)
        .json(user._doc);
    } else {
      const newUser = new UserModel({
        ...req.body,
        fromGoogle: true,
      });
      const savedUser = await newUser.save();
      const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECERET);
      res
        .cookie('access_token', token, {
          httpOnly: true,
          secure: 'production',
          sameSite: 'lax',
        })
        .status(200)
        .json(savedUser._doc);
    }
  } catch (err) {
    next(err);
  }
};

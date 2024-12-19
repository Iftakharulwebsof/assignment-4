const user= require('../models/user')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports.register = async (req, res) => {
  try {
    // Extract fields from the request body
    const { firstName, lastName, NIDNumber, phoneNumber, password, bloodGroup } = req.body;

    // Validate that all fields are provided
    if (!firstName || !lastName || !NIDNumber || !phoneNumber || !password || !bloodGroup) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the user already exists
    const userExists = await user.findOne({ NIDNumber });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Prepare user data
    const userData = {
      firstName,
      lastName,
      NIDNumber,
      phoneNumber,
      password: hashedPassword,
      bloodGroup,
    };

    // Save the user data to the database
    const userDataSave = new user(userData);
    await userDataSave.save(); // Ensure you wait for the save operation to complete

    // Respond with success
    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    console.error("Error during registration:", error.message);
    res.status(500).json({ error: error.message });
  }
};


module.exports.loginUser = async (req, res) => {
    const { NIDNumber, password } = req.body;
  
    try {
      const userVerify = await user.findOne({ NIDNumber });
      if (!userVerify) return res.status(400).json({ message: "Invalid credentials" });
  
      const isMatch = await bcrypt.compare(password, userVerify.password);
      if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
  
      const token = jwt.sign({ id: userVerify._id }, process.env.JWT_SECRET, { expiresIn: "10h" });
      res.cookie("token", token, { httpOnly: true });
  
      res.json({ message: "Login successful", token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

  module.exports.getAllUser = async (req, res) => {
    try {
     
      const result = await user.find({}, { firstName: 1, lastName: 1, NIDNumber: 1, phoneNumber: 1, bloodGroup: 1 });
  
     
      res.status(200).json(result);
    } catch (error) {
      
      res.status(500).json({ error: error.message });
    }
  };

  module.exports.getOne= async (req, res) => {
    try {

      const id = req.params.id
     
      const result = await user.findOne({_id:id},{ firstName: 1, lastName: 1, NIDNumber: 1, phoneNumber: 1, bloodGroup: 1 });
  
     
      res.status(200).json(result);
    } catch (error) {
      
      res.status(500).json({ error: error.message });
    }
  };
  
  module.exports.UpdateProfile = async (req, res) => {
    try {
      const id = req.params.id; 
      const { firstName, lastName, NIDNumber, phoneNumber, bloodGroup } = req.body;
  

      const result = await user.updateOne(
        { _id: id }, 
        { 
          $set: { firstName, lastName, NIDNumber, phoneNumber, bloodGroup } 
        }
      );
  
    
      res.status(200).json(result);
    } catch (error) {
 
      res.status(500).json({ error: error.message });
    }
  };
  
  
  module.exports.deleteSingleUser = async (req, res) => {
    try {
      const id = req.params.id; // Extract the user ID from the request parameters
  
      // Use `deleteOne` to remove the user with the specified ID
      const result = await user.deleteOne({ _id: id });
  
      if (result.deletedCount === 0) {
        // Handle case where the user is not found
        return res.status(404).json({ message: "User not found" });
      }
  
      // Return success response
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      // Handle errors
      res.status(500).json({ error: error.message });
    }
  };
  
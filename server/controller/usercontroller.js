import { User } from "../models/usermodel.js";
import { Admin } from "../models/adminmodel.js";
import { Question } from "../models/questionsmodel.js";
import { Section } from "../models/sectionmodel.js";
import jwt from "jsonwebtoken";
import { passwordValidator } from "../utils/passwordValidator.js";

// @POST
// user/register
// desc: API for creating new users
const registerUser = async (req, res) => {
  const { fullName, email, password, batch, date } = req.body;

  try {
    // Sanitizing inputs
    if (!fullName || !email || !password || !batch || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!email.trim()) {
      return res.status(400).json({ message: "Email cannot be empty" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Validate password
    const isValidPassword = passwordValidator(password);
    if (!isValidPassword) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, and one number",
      });
    }

    // Prevent duplicate accounts
    const existingUser = await User.findOne({ email });
    const existingAdmin = await Admin.findOne({ email });
    if (existingUser || existingAdmin) {
      return res.status(409).json({ message: "Email is already in use" });
    }

    // User creation
    const role = process.env.USER_ROLE || "user"; // Default to 'user' if environment variable is not set
    const user = await User.create({
      fullName,
      email,
      password,
      role,
      batch,
      date,
      sessions: [],
    });
    const createdUser = await User.findById(user._id).select("-password");
    if (!createdUser) {
      return res.status(500).json({ message: "User registration failed" });
    }

    return res
      .status(201)
      .json({ message: "User Registration Successful", data: createdUser });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Email is already in use" });
    }
    console.error("Error during registration:", err);
    return res
      .status(500)
      .json({ message: `Internal Server Error: ${err.message}` });
  }
};

// @POST
// user/login
// desc: Login API for user with credentials
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Sanitize and validate input
    if (!email?.trim() || !password?.trim()) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find the user
    const models = [User, Admin];
    let user = null;

    for (const model of models) {
      user = await model.findOne({ email });
      if (user) break;
    }

    if (!user) {
      return res.status(404).json({ message: "Email doesn't exist" });
    }

    // Check if the user has already logged in
    // if (user.hasLoggedIn) {
    //     return res.status(403).json({ message: "You have already submitted." });
    // }

    // Verify password
    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // // Mark user as logged in
    // user.hasLoggedIn = true;
    // await user.save();

    // Generate tokens
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    // Set refresh token in cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Secure only in production
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res
      .status(200)
      .json({ message: "Login successful", token: accessToken });
  } catch (err) {
    console.error("Error during login:", err);
    return res
      .status(500)
      .json({ message: `Internal Server Error: ${err.message}` });
  }
};

// @POST
// user/refresh
// desc: To create new access token once it has expired
const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json({ message: "Unauthorized API request" });
  }

  try {
    // Verify refresh token
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          if (err.name === "TokenExpiredError") {
            return res
              .status(403)
              .json({ message: "Refresh token expired. Please log in again." });
          }
          return res.status(403).json({ message: "Forbidden. Invalid token." });
        }

        let user;
        const role = Number(decoded.role);

        // Retrieve user based on role from decoded token
        if (!role) {
          return res
            .status(403)
            .json({ message: "Forbidden. Invalid user role." });
        }

        const adminRole = Number(process.env.ADMIN_ROLE);
        const userRole = Number(process.env.USER_ROLE);

        switch (role) {
          case adminRole:
            user = await Admin.findById(decoded.id);
            break;
          case userRole:
            user = await User.findById(decoded.id);
            break;
          default:
            return res.status(404).json({ message: "Invalid role" });
        }

        if (!user) {
          return res.status(404).json({ message: "Cannot find user" });
        }

        // Generate new access token
        const accessToken = await user.generateAccessToken();

        return res
          .status(200)
          .json({ message: "User validation successful", data: accessToken });
      }
    );
  } catch (err) {
    console.error("Error during token refresh:", err);
    return res
      .status(500)
      .json({ message: `Internal Server Error: ${err.message}` });
  }
};

// @POST
// user/logout
// desc: To logout a user and clear cookies
const logoutUser = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(204).json({ message: "No refresh token found" });
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Secure only in production
      sameSite: "None",
    });

    return res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    console.error("Error during logout:", err);
    return res
      .status(500)
      .json({ message: `Internal Server Error: ${err.message}` });
  }
};

// @GET
// get the mcq questions from admin
const getMcquestions = async (req, res) => {
  const { sectionId } = req.params;
  // console.log(sectionId)
  const { page = 1, limit = 10 } = req.query;
  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);
  const skip = (pageNumber - 1) * limitNumber;
  try {
    if (!sectionId) {
      return res.status(400).json({ message: "Section Id is required" });
    }
    const section = await Section.findById(sectionId)
      .select("MCQ")
      .slice("MCQ", [skip, limitNumber]); //pagination over the mcq
    if (!section || section.MCQ.length === 0) {
      return res
        .status(400)
        .json({ message: "No Questions available in the section" });
    }
    const totalQuestions = section.MCQ.length;
    const totalPages = Math.ceil(totalQuestions / limitNumber);
    const hasNextPage = pageNumber < totalPages;
    return res.status(200).json({
      message: "Questions fetched successfully",
      data: {
        questions: section.MCQ,
        hasNextPage,
        total: totalQuestions,
        currentPage: pageNumber,
      },
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
    return res
      .status(500)
      .json({ message: `Internal Server Error: ${error.message}` });
  }

  // try {

  //     // Pagination logic for quiz questions
  //     const totalQuestions = await Section.countDocuments({});
  //     const totalPages = Math.ceil(totalQuestions / limitNumber);
  //     const hasNextPage = pageNumber < totalPages;

  //     // Find questions with pagination
  //     const questions = await Question.find({})
  //         .select("question option1 option2 option3 option4")
  //         .skip(skip)
  //         .limit(limitNumber);

  //     if (questions.length === 0) {
  //         return res.status(404).json({ message: "No questions available" });
  //     }

  //     // Respond with question data and pagination info
  //     return res.status(200).json({
  //         message: "Questions fetched successfully",
  //         data: {
  //             questions,
  //             hasNextPage,
  //             total: totalQuestions,
  //             currentPage: pageNumber,
  //         },
  //     });
  // } catch (error) {
  //     console.error("Error fetching questions:", error);
  //     return res.status(500).json({ message: `Internal Server Error: ${error.message}` });
  // }
};
const getDescriptiveQuestions = async (req, res) => {
  const { sectionId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);
  const skip = (pageNumber - 1) * limitNumber;
  try {
    if (!sectionId) {
      return res.status(400).json({ message: "Section Id is required" });
    }
    const section = await Section.findById(sectionId)
      .select("Questions")
      .slice("Questions", [skip, limitNumber]); //pagination over the shortAnswer
    if (!section || section.Questions.length === 0) {
      return res
        .status(400)
        .json({ message: "No Questions available in the section" });
    }
    const totalQuestions = section.Questions.length;
    const totalPages = Math.ceil(totalQuestions / limitNumber);
    const hasNextPage = pageNumber < totalPages;
    return res.status(200).json({
      message: "Questions fetched successfully",
      data: {
        questions: section.Questions,
        hasNextPage,
        total: totalQuestions,
        currentPage: pageNumber,
      },
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
    return res
      .status(500)
      .json({ message: `Internal Server Error: ${error.message}` });
  }
};

// @POST
// user/submit-quiz
// desc: Submit quiz answers and calculate score
// @POST
// user/submit-quiz
// desc: Submit quiz answers and calculate score

// Working SUBMITQUIZ controller with automated mark calculation used in the earlier version of Quiz app used for MCQ quiz submit
//   ********------START------*********

const submitQuiz = async (req, res) => {
  try {
    const { userId } = req.params;
    const { answers, disqualified } = req.body;

    if (disqualified) {
      // Handle disqualified users
      const user = await User.findById(userId);
      if (user) {
        user.score = 0; // Optionally set score to 0
        user.performance = "Disqualified"; // Mark performance as disqualified
        user.userStrength = null; // Optionally reset user strength
        user.hasLoggedIn = true;
        await user.save();
      } else {
        return res.status(404).json({ message: "User not found" });
      }

      // Respond with disqualified status
      return res.status(200).json({
        message: "Quiz submitted successfully",
        data: {
          score: 0,
          percentageScore: 0,
          performance: "Disqualified",
          totalQuestions: 0,
          evaluation: [],
          userStrength: null,
        },
      });
    }

    if (!answers || answers.length === 0) {
      return res.status(400).json({ message: "No answers submitted" });
    }

    // Find all questions
    const questionIds = answers.map((answer) => answer.questionId);
    const questions = await Question.find({ _id: { $in: questionIds } });

    if (questions.length === 0) {
      return res.status(404).json({ message: "Questions not found" });
    }

    // Calculate score
    let score = 0;
    let technicalCorrect = 0;
    let nonTechnicalCorrect = 0;
    const totalQuestions = questions.length;

    const evaluation = questions.map((question) => {
      const submittedAnswer = answers.find(
        (answer) => answer.questionId === question._id.toString()
      );
      let isCorrect = false;
      let selectedOption = null;

      // Check if question was skipped
      if (!submittedAnswer || !submittedAnswer.selectedOption) {
        isCorrect = false;
      } else {
        selectedOption = submittedAnswer.selectedOption;
        isCorrect = question.correctAns === selectedOption;
        if (isCorrect) {
          score += 1;
          if (question.category === "Technical") {
            technicalCorrect += 1;
          } else if (question.category === "NonTechnical") {
            nonTechnicalCorrect += 1;
          }
        }
      }

      return {
        category: question.category,
        questionId: question._id.toString(),
        question: question.question,
        selectedOption: selectedOption, // Null for skipped questions
        correctAnswer: question.correctAns,
        isCorrect: isCorrect,
        isSkipped: !submittedAnswer || !submittedAnswer.selectedOption, // Mark as skipped if no answer
      };
    });

    // Determine user's strength based on correct answers by category
    let strength = "Equal";
    if (technicalCorrect > nonTechnicalCorrect) {
      strength = "Technical";
    } else if (nonTechnicalCorrect > technicalCorrect) {
      strength = "NonTechnical";
    }

    // Convert the score to a percentage
    const percentageScore = (score / totalQuestions) * 100;

    // Classify the score based on the range
    let performance;
    if (percentageScore >= 80) {
      performance = "High";
    } else if (percentageScore >= 50) {
      performance = "Medium";
    } else if (percentageScore >= 30) {
      performance = "Low";
    } else {
      performance = "Very Low";
    }

    // Save score, performance, and strength in the user's record
    const user = await User.findById(userId);
    if (user) {
      user.score = score;
      user.performance = performance;
      user.userStrength = strength;
      // user.hasLoggedIn = true;
      await user.save();
    } else {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with the score and detailed evaluation
    return res.status(200).json({
      message: "Quiz submitted successfully",
      data: {
        score,
        percentageScore,
        performance,
        totalQuestions,
        evaluation,
        userStrength: strength,
      },
    });
  } catch (error) {
    console.error("Error submitting quiz:", error);
    return res
      .status(500)
      .json({ message: `Internal Server Error: ${error.message}` });
  }
};

//   ********------SUBMITQUIZ controller END------*********

// Working mcq quiz submit controller
const submitQuizMcq = async (req, res) => {
  try {
    const { userId, sectionId } = req.params;
    const { answers, disqualified } = req.body;

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the session already exists for the given sectionId
    let sessionIndex = user.sessions.findIndex(
      (s) => s.sectionId.toString() === sectionId
    );

    if (sessionIndex === -1) {
      // Session does not exist, create a new one and push it to the sessions array
      user.sessions.push({
        sectionId,
        mcqAnswers: [],
        descriptiveAnswers: [],
        score: 0,
        performance: null,
        completedAt: null,
      });
      sessionIndex = user.sessions.length - 1; // Update index to the new session's position
    }

    const session = user.sessions[sessionIndex];

    // Handle disqualification case
    if (disqualified) {
      session.mcqAnswers = [
        {
          questionId: null,
          selectedOption: null,
          isCorrect: false,
          performance: "Disqualified",
          completedAt: new Date(),
        },
      ];
      session.score = 0;
      session.performance = "Disqualified";
      session.completedAt = new Date();

      await user.save();

      return res.status(200).json({
        message: "You have been disqualified",
        data: {
          score: 0,
          performance: "Disqualified",
          userStrength: null,
        },
      });
    }

    if (!answers || answers.length === 0) {
      return res.status(400).json({ message: "No answers submitted" });
    }

    // Retrieve MCQ questions for the section
    const section = await Section.findById(sectionId);
    if (!section || !section.MCQ || section.MCQ.length === 0) {
      return res
        .status(404)
        .json({ message: "MCQ questions not found in section" });
    }

    // Process answers and calculate scores
    let score = 0;
    let technicalCorrect = 0;
    let nonTechnicalCorrect = 0;
    const totalQuestions = section.MCQ.length;
    const mcqAnswers = [];

    section.MCQ.forEach((question) => {
      const answer = answers.find(
        (a) => a.questionId === question._id.toString()
      );
      if (answer) {
        const isCorrect = answer.selectedOption === question.correctAns;
        if (isCorrect) {
          score++;
          if (question.category === "Technical") {
            technicalCorrect++;
          } else {
            nonTechnicalCorrect++;
          }
        }

        mcqAnswers.push({
          questionId: question._id,
          selectedOption: answer.selectedOption,
          isCorrect: isCorrect,
        });
      }
    });

    // Calculate user's strength and performance
    const userStrength =
      technicalCorrect > nonTechnicalCorrect ? "Technical" : "NonTechnical";
    const percentageScore = (score / totalQuestions) * 100;
    const performance =
      percentageScore >= 80
        ? "High"
        : percentageScore >= 50
        ? "Medium"
        : percentageScore >= 30
        ? "Low"
        : "Very Low";

    // Update session-specific data
    session.mcqAnswers.push(...mcqAnswers);
    session.score = score;
    session.performance = performance;
    session.completedAt = new Date();

    // Save the updated user data
    await user.save();

    // Respond with the score and detailed evaluation
    return res.status(200).json({
      message: "Quiz submitted successfully",
      data: {
        score,
        percentageScore,
        performance,
        totalQuestions,
        userStrength,
      },
    });
  } catch (error) {
    console.error("Error submitting quiz:", error);
    return res
      .status(500)
      .json({ message: `Internal Server Error: ${error.message}` });
  }
};

const submitQuizDescriptive = async (req, res) => {
  try {
    const { userId } = req.params;
    const { answers, disqualified } = req.body;

    if (disqualified) {
      const user = await User.findById(userId);
      if (user) {
        user.performance = "Disqualified";
        user.hasLoggedIn = true;
        await user.save();
      } else {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({
        message: "Quiz submitted successfully",
        data: { performance: "Disqualified" },
      });
    }

    if (!answers || answers.length === 0) {
      return res.status(400).json({ message: "No answers submitted" });
    }

    const section = await Section.findOne({
      "Questions._id": { $in: answers.map((a) => a.questionId) },
    });

    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }

    const questions = section.Questions.filter((question) =>
      answers.some((answer) => answer.questionId === question._id.toString())
    );

    if (questions.length === 0) {
      return res
        .status(404)
        .json({ message: "No descriptive questions found in the section" });
    }

    const evaluation = questions.map((question) => {
      const submittedAnswer = answers.find(
        (answer) => answer.questionId === question._id.toString()
      );
      return {
        questionId: question._id.toString(),
        question: question.question,
        submittedAnswer: submittedAnswer ? submittedAnswer.writtenAnswer : null,
        isSkipped: !submittedAnswer || !submittedAnswer.writtenAnswer,
      };
    });

    const user = await User.findById(userId);
    if (user) {
      // user.hasLoggedIn = true;
      await user.save();
    } else {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Descriptive quiz submitted successfully",
      data: { evaluation },
    });
  } catch (error) {
    console.error("Error submitting descriptive quiz:", error);
    return res
      .status(500)
      .json({ message: `Internal Server Error: ${error.message}` });
  }
};

// to post the answers from user to the descriptiveAnswers Schema
const descriptiveQuizSubmit = async (req, res) => {
  try {
    const { userId, sectionId } = req.params; // Get sectionId from params
    const { answers, disqualified } = req.body;

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the session already exists for the given sectionId
    let sessionIndex = user.sessions.findIndex(
      (s) => s.sectionId.toString() === sectionId
    );

    if (sessionIndex === -1) {
      // Session does not exist, create a new one and push it to the sessions array
      user.sessions.push({
        sectionId,
        mcqAnswers: [],
        descriptiveAnswers: [],
        performance: null,
        completedAt: null,
      });
      sessionIndex = user.sessions.length - 1; // Update index to the new session's position
    }

    const session = user.sessions[sessionIndex];

    // Handle disqualification case
    if (disqualified) {
      session.descriptiveAnswers = [
        {
          questionId: null,
          answerText: null,
          performance: "Disqualified",
          completedAt: new Date(),
        },
      ];
      session.performance = "Disqualified";
      session.completedAt = new Date();

      await user.save();

      return res.status(200).json({
        message: "You have been disqualified",
        data: {
          performance: "Disqualified",
        },
      });
    }

    if (!answers || answers.length === 0) {
      return res.status(400).json({ message: "No answers submitted" });
    }

    // Process descriptive answers and include sectionId
    const descriptiveAnswers = answers.map((answer) => ({
      questionId: answer.questionId,
      answerText: answer.answerText,
      sectionId,
    }));

    // Update session-specific data
    session.descriptiveAnswers.push(...descriptiveAnswers);
    session.completedAt = new Date();

    // Save the updated user data
    await user.save();

    // Respond with success message
    return res.status(200).json({
      message: "Descriptive quiz submitted successfully",
      data: {
        descriptiveAnswers: session.descriptiveAnswers,
      },
    });
  } catch (error) {
    console.error("Error submitting descriptive quiz:", error);
    return res
      .status(500)
      .json({ message: `Internal Server Error: ${error.message}` });
  }
};

// get all  users
const getAllUsers = async (request, response) => {
  try {
    const userData = await User.find();
    response
      .status(200)
      .json({ message: "userdata fetched succesfully", data: userData });
  } catch (error) {
    response
      .status(400)
      .json({ message: `internal server error due to ${error}` });
  }
};

// get users by id
const getUserById = async (request, response) => {
  const { userId } = request.params;
  try {
    const userData = await User.findById(userId);
    response
      .status(200)
      .json({ message: "userdata fetched succesfully", data: userData });
  } catch (error) {
    response
      .status(400)
      .json({ message: `internal server error due to ${error}` });
  }
};
const checkUserQuizSubmit = async (req, res) => {
  const { userId, sectionId } = req.params;

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user has an active session for the specific section
    const session = user.sessions.find(
      (s) => s.sectionId.toString() === sectionId
    );

    // If no session exists for the section, assume it's the user's first attempt for this section
    if (!session) {
      return res.status(200).json({
        attempted: false,
        disqualified: false,
        message:
          "User has no prior attempts for this section. Proceed with the quiz.",
      });
    }

    // Check if the user has been disqualified in this section
    const mcqDisqualified =
      session.mcqAnswers.length !== 0 && session.performance === "Disqualified";
    const descriptiveDisqualified =
      session.descriptiveAnswers.length !== 0 &&
      session.performance === "Disqualified";

    if (mcqDisqualified || descriptiveDisqualified) {
      return res.status(200).json({
        attempted: true,
        disqualified: true,
        message: "User has been disqualified form this section.",
      });
    }

    // Check if the user has already attempted this section
    const hasAttempted =
      (session.mcqAnswers.length !== 0 &&
        session.mcqAnswers.performance != "Disqualified") ||
      (session.descriptiveAnswers.length !== 0 &&
        session.descriptiveAnswers.performance != "Disqualified");
    if (hasAttempted) {
      return res.status(200).json({
        attempted: true,
        disqualified: false,
        message: "User has already completed this section.",
      });
    }

    // If the user hasn't attempted or been disqualified, allow the quiz to proceed
    return res.status(200).json({
      attempted: false,
      disqualified: false,
      message: "User can proceed with the quiz for this section.",
    });
  } catch (error) {
    console.error("Error in checkUserQuizSubmit:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// to retrive the mcq sections session wise(session inside user)
const getUserWiseMcq = async (req, res) => {
  const { userId, sessionId } = req.params;

  if (!userId || !sessionId) {
    return res.status(400).json({ message: "Missing userId or sessionId" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const session = user.sessions.find((s) => s._id.toString() === sessionId);
    if (!session) {
      return res
        .status(404)
        .json({ message: "Session not found in user's data" });
    }

    // Check for the MCQ array and performance status
    if (session.mcqAnswers && session.performance !== "disqualified") {
      res
        .status(200)
        .json({
          message: "Session retrival succefull",
          data: session.mcqAnswers,
        });
    } else {
      res
        .status(200)
        .json({ message: "No MCQ or performance is disqualified" });
    }
  } catch (error) {
    console.error("Error fetching user or session:", error);
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};
// to retrive mcq questions so that we can display questions.
const getSingleMcquestions = async (req, res) => {
  const { sectionId } = req.params;
  const { questionId } = req.query; // Read questionId from query parameters

  try {
    const section = await Section.findById(sectionId);
    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }

    const question = section.MCQ?.find((q) => q._id.toString() === questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    return res
      .status(200)
      .json({ message: "Question fetch successful", data: question });
  } catch (error) {
    console.error("Error fetching question:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const getSingleDescriptiveQuestions = async (req, res) => {
  const { sectionId } = req.params;
  const { questionId } = req.query; // Read questionId from query parameters

  try {
    const section = await Section.findById(sectionId);
    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }

    const question = section.Questions?.find(
      (q) => q._id.toString() === questionId
    );
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    return res
      .status(200)
      .json({ message: "Question fetch successful", data: question });
  } catch (error) {
    console.error("Error fetching question:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const getSingleDescriptiveAnswers = async (req, res) => {
  const { answerId } = req.query; // Get answerId from query params

  try {
    // Check if answerId is provided
    if (!answerId) {
      return res.status(400).json({ message: "No answer found" });
    }

    // Find the user and the session containing the descriptive answer
    const user = await User.findOne({
      "sessions.descriptiveAnswers._id": answerId, // Search for answerId inside descriptiveAnswers in any session
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "No answer found for the provided answerId" });
    }

    // Iterate over the sessions to find the exact session and the answer
    let answer = null;
    for (let session of user.sessions) {
      // Find the answer within each session's descriptiveAnswers array
      answer = session.descriptiveAnswers.find(
        (ans) => ans._id.toString() === answerId
      );
      if (answer) break; // Stop the loop if the answer is found
    }

    // If the answer is not found, return an error
    if (!answer) {
      return res
        .status(400)
        .json({ message: "Answer not found in the session" });
    }

    // Return the found answer
    return res.status(200).json({
      message: "Answer retrieved successfully",
      data: answer, // Send the specific answer data
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// to retrive descriptive questions session wise.
const getUserWiseDescriptive = async (req, res) => {
  const { userId, sessionId } = req.params;

  if (!userId || !sessionId) {
    return res.status(400).json({ message: "Missing userId or sessionId" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const session = user.sessions.find((s) => s._id.toString() === sessionId);
    if (!session) {
      return res
        .status(404)
        .json({ message: "Session not found in user's data" });
    }

    // Check for the descriptive array and performance status
    if (session.descriptiveAnswers && session.performance !== "disqualified") {
      res
        .status(200)
        .json({
          message: "Session retrival succefull",
          data: session.descriptiveAnswers,
        });
    } else {
      res
        .status(200)
        .json({ message: "No MCQ or performance is disqualified" });
    }
  } catch (error) {
    console.error("Error fetching user or session:", error);
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};

const getUserMcqPerformance = async (req, res) => {
  const { userId, sessionId } = req.params;

  // Validate input parameters
  if (!userId || !sessionId) {
    return res.status(400).json({ message: "Missing userId or sessionId" });
  }

  try {
    // Fetch user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the session inside the user's sessions array
    const session = user.sessions.find((s) => s._id.toString() === sessionId);
    if (!session) {
      return res
        .status(404)
        .json({ message: "Session not found in user's data" });
    }

    // Check performance and score in the session
    if (session.performance !== "disqualified") {
      const { performance, score } = session;

      return res.status(200).json({
        message: "Session retrieval successful",
        data: {
          performance,
          score,
          sessionDetails: session, // Include all session details for context
        },
      });
    } else {
      return res.status(200).json({
        message: "User's performance is disqualified for this session",
        data: { performance: session.performance },
      });
    }
  } catch (error) {
    console.error("Error fetching user or session:", error);
    return res.status(500).json({ message: "An error occurred", error: error.message });
  }
};

const getUserDescriptivePerformance = async (req, res) => {
  const { userId, sessionId } = req.params;

  // Validate input parameters
  if (!userId || !sessionId) {
    return res.status(400).json({ message: "Missing userId or sessionId" });
  }

  try {
    // Fetch user by ID
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the session inside the user's sessions array
    const session = user.sessions.find((s) => s._id.toString() === sessionId);
    if (!session) {
      return res
        .status(404)
        .json({ message: "Session not found in user's data" });
    }

    // Check performance and score in the session
    if (session.performance !== "disqualified") {
      const { performance, score } = session;

      return res.status(200).json({
        message: "Session retrieval successful",
        data: {
          performance,
          score,
          sessionDetails: session, // Include all session details for context
        },
      });
    } else {
      return res.status(200).json({
        message: "User's performance is disqualified for this session",
        data: { performance: session.performance },
      });
    }
  } catch (error) {
    console.error("Error fetching user or session:", error);
    return res.status(500).json({ message: "An error occurred", error: error.message });
  }
};

export {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  getMcquestions,
  getDescriptiveQuestions,
  submitQuiz,
  submitQuizMcq,
  getAllUsers,
  getUserById,
  submitQuizDescriptive,
  descriptiveQuizSubmit,
  checkUserQuizSubmit,
  getUserWiseMcq,
  getSingleMcquestions,
  getSingleDescriptiveQuestions,
  getSingleDescriptiveAnswers,
  getUserWiseDescriptive,
  getUserMcqPerformance,
  getUserDescriptivePerformance
};

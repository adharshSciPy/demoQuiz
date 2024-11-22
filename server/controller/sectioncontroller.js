import { Section } from "../models/sectionmodel.js";
import { QuizSection } from "../models/quizSection.js";


const sectionPost = async (req, res) => {
    const { sectionName, date, questionType } = req.body;
    try {
        const newSection = await Section.create({
            sectionName, date, questionType, Questions: []
        })
        res.status(200).json({ message: "Sections created successfully", data: newSection })

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", err: error.message })
    }
}

const questionsSection = async (req, res) => {
    const { sectionId } = req.params;
    const { question, answer, mark, questionCategory } = req.body;

    try {
        const result = await Section.findByIdAndUpdate(sectionId, {
            $push: {
                Questions: [{
                    question: req.body.question,
                    answer: req.body.answer,
                    mark: req.body.mark,
                    questionCategory: req.body.questionCategory
                }]
            }
        }, { new: true })

        res.status(200).json({ message: "Question added successfully", data: result })
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error ", err: error.message })

    }
}

const McqSection = async (req, res) => {
    const { sectionId } = req.params;
    const { category, question, option1, option2, option3, option4, score, correctAns, questionCategory } = req.body

    try {
        const result = await Section.findByIdAndUpdate(sectionId, {
            $push: {
                MCQ: [{
                    category: req.body.category,
                    question: req.body.question,
                    option1: req.body.option1,
                    option2: req.body.option2,
                    option3: req.body.option3,
                    option4: req.body.option4,
                    score: req.body.score,
                    correctAns: req.body.correctAns,
                    questionCategory: req.body.questionCategory
                }]
            }
        }, { new: true })

        res.status(200).json({ message: "Question added successfully", data: result })
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error", err: error.message })
    }
}

const getSections = async (req, res) => {
    try {
        const sections = await Section.find();
        res.status(200).json({ message: "Sections retrieved successfully", data: sections })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", err: error.message })
    }
}
const getSectionsById = async (req, res) => {
    const { sectionId } = req.params
    try {
        const sections = await Section.findById(sectionId);
        res.status(200).json({ message: "Section retrieved successfully", data: sections })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", err: error.message })
    }
}

const deleteSections = async (req, res) => {
    const { sectionId } = req.params;
    try {
        const deletedSection = await Section.findByIdAndDelete(sectionId);
        res.status(200).json({ message: "Section deleted successfully", data: deletedSection })
    } catch (error) {
        res.status(500).json({ message: "Internal server error due to", err: error.message })
    }
}
const deleteSectionMcq = async (req, res) => {
    const { sectionId } = req.params;
    const { id } = req.body;

    try {
        const deletedQuestion = await Section.findByIdAndUpdate(sectionId, {
            $pull: { MCQ: { _id: id } }
        }, { new: true })
        if (!deletedQuestion) {
            return res.status(400).json({ message: "Question didn't found" })
        }
        res.status(200).json({ message: "Question deleted succesfully", data: deletedQuestion })

    } catch (error) {
        console.log(error);

    }


}
const deleteSectionDescripive = async (req, res) => {
    const { sectionId } = req.params;
    const { id } = req.body;

    try {
        const deletedQuestion = await Section.findByIdAndUpdate(sectionId, {
            $pull: { Questions: { _id: id } }
        }, { new: true })
        if (!deletedQuestion) {
            return res.status(400).json({ message: "Question didn't found" })
        }
        res.status(200).json({ message: "Question deleted succesfully", data: deletedQuestion })

    } catch (error) {
        console.log(error);

    }


}

// controller to get the section details on the user side used on the Instruction page of user(on the startquiz function)

const getQuizSection = async (req, res) => {
    

    try {
        const sections = await QuizSection.find();
        res.status(200).json({ message: "Section retrieved successfully", data: sections })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", err: error.message })
    }
}


const getQuestionsFromSection = async (req, res) => {
    try {
      // Extract sectionId from the request parameters
      const { sectionId } = req.params;
  
      // Find the section by its ID
      const section = await Section.findById(sectionId); // No need to populate as questions are embedded
  
      // Check if the section exists
      if (!section) {
        return res.status(404).json({ message: 'Section not found' });
      }
  
      // Respond with the questions from the found section
      return res.status(200).json({
        data: {
          shortAnswerQuestions: section.Questions,
          mcqQuestions: section.MCQ,
        },
      });
    } catch (error) {
      console.error('Error fetching questions:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };


  const startQuiz= async (req, res) => {
    const { sectionId, questionType } = req.body;
    console.log("section id:",sectionId)
    console.log("type",questionType);
   
    await QuizSection.findOneAndUpdate(
        {}, // Assuming only one active session at a time
        { sectionId, questionType, isActive: true, startTime: new Date() },
        { upsert: true, new: true }
    );
    res.status(200).json({ message: "Quiz started",data:{sectionId,questionType} });
};

const changeIsActiveBadge = async (req, res) => {
    const { sectionId } = req.body;

    if (!sectionId) {
        return res.status(400).json({ message: "sectionId is required" });
    }

    try {
        // Toggle isActiveBadge based on current value
        const section = await Section.findById(sectionId);

        if (!section) {
            return res.status(404).json({ message: "Section not found" });
        }

        const updatedSection = await Section.findByIdAndUpdate(
            sectionId,
            { isActiveBadge: !section.isActiveBadge },
            { new: true }
        );

        return res.status(200).json({
            message: "Status toggled successfully",
            data: updatedSection,
        });
    } catch (error) {
        console.error("Error updating isActiveBadge:", error);
        return res.status(500).json({ message: "Internal server error", error });
    }
};
const toggleReverse=async(req,res)=>{
    const { sectionId } = req.body;

    if (!sectionId) {
        return res.status(400).json({ message: "sectionId is required" });
    }

    try {
        // Toggle isActiveBadge based on current value
        const section = await Section.findById(sectionId);

        if (!section) {
            return res.status(404).json({ message: "Section not found" });
        }

        const updatedSection = await Section.findByIdAndUpdate(
            sectionId,
            { isActiveBadge: !section.isActiveBadge },
            { new: true }
        );

        return res.status(200).json({
            message: "Status toggled successfully",
            data: updatedSection,
        });
    } catch (error) {
        console.error("Error updating isActiveBadge:", error);
        return res.status(500).json({ message: "Internal server error", error });
    }
}
const checkActiveBadge = async (req, res) => {
    const { sectionId } = req.query;
  
    // Validate the presence of sectionId
    if (!sectionId) {
      return res.status(400).json({ message: "sectionId is required" });
    }
  
    try {
      // Fetch the section by ID
      const section = await Section.findById(sectionId);
  
      // Handle case where the section is not found
      if (!section) {
        return res.status(404).json({ message: "Section not found" });
      }
  
      // Check the isActiveBadge status
      const data = section.isActiveBadge === true;
      return res.status(200).json({
        message: "Data retrieval successful",
        sectionId: section._id,
        isActiveBadge: data,
      });
    } catch (error) {
      // Return error details
      return res.status(500).json({ message: "An error occurred", error });
    }
  };
  
export { sectionPost, questionsSection, getSections, McqSection, deleteSections, getSectionsById, deleteSectionMcq, deleteSectionDescripive,getQuizSection,getQuestionsFromSection,startQuiz,changeIsActiveBadge,checkActiveBadge ,toggleReverse}
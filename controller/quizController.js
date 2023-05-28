const Quiz = require("../models/QuizSchema");
const cloudinary = require("cloudinary").v2;
const upload = require("../middleware/uploadMiddleware");


// get All Category Api
const getQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.find().sort({ updatedAt: -1 })
    .exec();
    res.json(quiz);
  } catch (err) {
    return res.status(500).json({
      errors: {
        common: {
          msg: `Unknown error occured ! ${err}`,
        },
      },
    });
  }
};

const getCategory_NameWise_AllQuiz = async (req, res, next) => {
  const categoryName = req.query.category; // retrieve category name from query parameter
  const status="active";
  console.log("Category", categoryName);
  try {
    if (!categoryName) {
      return res.status(400).json({
        errors: {
          common: {
            msg: `Category name is required in the query parameter!`,
          },
        },
      });
    }
    
    const quiz = await Quiz.find({ category: categoryName, quiz_status: status })
    .sort({ updatedAt: -1 })
    .exec();
    if (!quiz || quiz.length === 0) {
      return res.status(404).json({
        errors: {
          common: {
            msg: `No quiz found for category ${categoryName}!`,
          },
        },
      });
    }
    res.json(quiz);
  } catch (err) {
    return res.status(500).json({
      errors: {
        common: {
          msg: `Unknown error occurred! ===> ${err}`,
        },
      },
    });
  }
};



//get Single Package Api
const getSingleQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    res.json(quiz);
  } catch (err) {
    return res.status(500).json({
      errors: {
        common: {
          msg: `Unknown error occured ! ${err}`,
        },
      },
    });
  }
};


// Add Quiz Post Api Controller
// const addQuiz = async (req, res) => {
//   let newQuiz;
//   newQuiz = new Quiz({
//     ...req.body,
//   });
//   try {
//     await newQuiz.save();
//     res.status(200).json({
//       message: "Quiz Add Successfully !",
//     });
//   } catch (err) {
//     res.status(500).json({
//       errors: {
//         common: {
//           msg: "Unknown Error Occured ",
//         },
//       },
//     });
//   }
// };

const addQuiz = async (req,res,next)=>{
  try{
    const {category,quiz_status,quiz_name,quiz_description,accessibility} = req.body;
    
    // Create a new quiz 
    const newQuiz = new Quiz({
      category,
      quiz_status,
      quiz_name,
      quiz_description,
      accessibility
    });
    if(req.file){
      cloudinary.uploader.upload(req.file.path, async(err,result)=>{
        if(err){
          console.log(err);
          throw new Error("Image upload failed");
        }

        newQuiz.image = result.secure_url; 
        newQuiz.publicid = result.public_id;

        //save the question to the database 
        await newQuiz.save(); 

        res.status(201).json({success:true, data: newQuiz}); 
      });
    }else{
      await newQuiz.save();
      res.status(201).json({success:true, data: newQuiz});
    }
  
  }
  catch(error){
    res.status(500).json({success:false,error:error.message})
  }
}

// UpdateQuiz Api Controller
// const updateQuiz = async (req, res, next) => {
//   try {
//     const UpdateQuiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });
//     res.send(UpdateQuiz);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// };

const updateQuiz = async (req,res)=>{
  try{
    const {category,quiz_status,quiz_name,quiz_description,accessibility} = req.body;
    const {id} = req.params;

    // Find the quiz by ID 
    const quiz = await Quiz.findById(id); 

    if(!quiz){
      return res.status(404).json({success: false, error : "Quiz not found"});
    }
    quiz.quiz_name = quiz_name; 
    quiz.quiz_description = quiz_description; 
    quiz.quiz_status = quiz_status;
    quiz.category = category; 
    quiz.accessibility = accessibility;

    // Check if an image was uploaded 
    if(req.file){
      cloudinary.uploader.upload(req.file.path, async(err, result)=>{
        if(err){
          console.log(err); 
          throw new Error("Image uplaod failed"); 
        }
        quiz.image = result.secure_url; 
        quiz.publicid = result.public_id; 

        await quiz.save();
        res.json({success: true, data: quiz}); 
      }); 
    }else{
      await quiz.save(); 
      res.json({success: true, data: quiz}); 
    }

  }
  catch(error){
    res.status(500).json({success: false, error: error.message});
  }
}

// Delete Quiz Api Controller
const deleteQuiz = async (req, res, next) => {
 
    const id = req.params.id;
    Quiz.findByIdAndDelete(id, function(err,quizdata){
      if(err){
        console.log(err); 
        return res.status(500).json({error: "Failed to delete Quiz Data from database"});
      }
      if(!quizdata){
        return res.status(404).json({error: "Quiz Data not Found"}); 
      }
      // Delete image form Cloudinary
      cloudinary.uploader.destroy(quizdata.publicid, function(err,result){
        if(err){
          console.log(err); 
          return res.status(500).json({error: "Failded to delete image from Cloudinary"})
        }
        console.log(result); 
        res.status(200).json({message: "Quiz data deleted successfully"});
      })
    })
};

module.exports = {
  getQuiz,
  addQuiz,
  updateQuiz,
  deleteQuiz,
  getSingleQuiz,
  getCategory_NameWise_AllQuiz
};

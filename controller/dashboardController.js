const People = require("../models/People");
const ImageDatas = require("../models/imageSchema");
const Categories = require("../models/CategorySchema");
const Sliders = require("../models/SliderSchema");
const DownloadModel = require("../models/DownloadSchema");
const Quiz = require("../models/QuizSchema");
const Question = require("../models/QuestionSchema");

const getAllData = async (req, res) => {
  try {
    // const imageCountPipeline = [{ $group: { _id: null, totalImages: { $sum: 1 } } }];
    // const imageCount = await ImageDatas.aggregate(imageCountPipeline);
    const quizCount = await Quiz.countDocuments({});
    const categoryCount = await Categories.countDocuments({});
    const userCount = await People.countDocuments({});
    const sliderCount = await Sliders.countDocuments({});
    const questionCount = await Question.countDocuments({});
    
    const downloadCountPipeline = [{ $group: { _id: null, totalDownloads: { $sum: "$downloadCount" } } }];
    const downloadCount = await DownloadModel.aggregate(downloadCountPipeline);

    res.json({
      // totalImages: imageCount[0].totalImages,
      totalCategories: categoryCount,
      totalUserDatas: userCount,
      totalSliderDatas: sliderCount,
      totalquiz : quizCount,
      totalquestion : questionCount,
     
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllData,
};

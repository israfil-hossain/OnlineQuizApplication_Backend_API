const getAllData = async (req, res) => {
    try {
      res.status(200).send(`<h1>Everything is OK .</h1>`);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  module.exports = {
    getAllData,
  };
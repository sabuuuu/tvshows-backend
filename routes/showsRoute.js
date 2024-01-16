import express from 'express';
import searchTVShows from '../controllers/subController.js';

const router = express.Router();

router.get('/countWordOccurrencesByTVShow', async (req, res) => {
  try {
    const wordOccurrencesByTVShow = await countWordOccurrencesByTVShow();

    console.log('Word occurrences by TV show:', wordOccurrencesByTVShow);
    return res.status(200).json({ 
        message: 'Word occurrences by TV show' ,
        count : wordOccurrencesByTVShow.length,
        data : wordOccurrencesByTVShow
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get('/search', async (req, res) => {
  const keywords = req.query.keywords; // Assuming the keywords are sent as a query parameter

  try {
    const results = await searchTVShows(keywords);
    res.status(200).json(results);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});


export default router;

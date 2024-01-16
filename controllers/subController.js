import {Occurence } from '../models/subSchema.js';
import mongoose from 'mongoose';

const countWordOccurrencesByTVShow = async () => {
    try {
      console.log('Counting word occurrences by TV show...');
  
      // Retrieve the MongoDB collection object
      const collection = mongoose.connection.db.collection('mots_extraits_test_lem');
  
      // Fetch all subtitles from MongoDB
      const allSubtitles = await collection.find({}).toArray();
  
      // Initialize an object to store word occurrences for each TV show
      const wordOccurrencesByTVShow = {};
  
      // Process each subtitle
      allSubtitles.forEach(subtitle => {
        const tvShowName = subtitle.nom_dossier;
  
        // Initialize the word occurrences for the TV show if it doesn't exist
        if (!wordOccurrencesByTVShow[tvShowName]) {
          wordOccurrencesByTVShow[tvShowName] = {};
        }
  
        // Count word occurrences in the subtitle
        subtitle.mots.forEach(word => {
          wordOccurrencesByTVShow[tvShowName][word] = (wordOccurrencesByTVShow[tvShowName][word] || 0) + 1;
        });
      });
  
      // Log the word occurrences by TV show
      console.log('Word occurrences by TV show:', wordOccurrencesByTVShow);
  
      // Save the word occurrences to the 'occurrences' collection
      await Occurence.insertMany(Object.entries(wordOccurrencesByTVShow).map(([tvShowName, wordOccurrences]) => ({
        tvShowName,
        wordOccurrences,
      })));
  
      console.log('Word occurrences saved to the "occurrences" collection.');
  
      return wordOccurrencesByTVShow;
    } catch (error) {
      console.error('Error counting word occurrences:', error);
      throw error;
    }
}


const searchTVShows = async (keywords) => {
  try {
    // Retrieve TF_IDF collection
    const tfIdfCollection = mongoose.connection.db.collection('TF_IDF');

    // Fetch TF_IDF data
    const tfIdfData = await tfIdfCollection.find().toArray();

    // Preprocess keywords
    keywords = keywords.toLowerCase().split(" ");

    // Calculate relevance scores directly
    const results = tfIdfData.map((data) => {
      let relevanceScore = 0;

      keywords.forEach((keyword) => {
        if (data.TF_IDF[keyword]) {
          relevanceScore += data.TF_IDF[keyword];
        }
      });

      return {
        tvShowName: data.nom_serie,
        relevanceScore,
      };
    });

    // Sort by relevance and return top 10
    results.sort((a, b) => b.relevanceScore - a.relevanceScore);
    return results.slice(0, 10);
  } catch (error) {
    console.error("Error:", error);
  }
};




export default searchTVShows;
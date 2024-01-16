import mongoose from 'mongoose';

const occurrenceSchema = new mongoose.Schema({
  tvShowName: String,
  wordOccurrences: Object,
});


export const Occurence = mongoose.model('Occurence', occurrenceSchema);
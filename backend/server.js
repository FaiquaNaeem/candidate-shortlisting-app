require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { OpenAI } = require('openai');
const Candidate = require('./models/Candidate');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    "https://candidate-shortlisting-app-sooty.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

// GET /api/candidates → get all candidates
app.get('/api/candidates', async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ createdAt: -1 });
    res.json(candidates);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({ error: 'Failed to fetch candidates' });
  }
});

// POST /api/candidates → add a candidate
app.post('/api/candidates', async (req, res) => {
  try {
    const { name, email, skills, experience, bio } = req.body;
    const newCandidate = new Candidate({
      name,
      email,
      skills: Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim()),
      experience,
      bio,
    });
    const savedCandidate = await newCandidate.save();
    res.status(201).json(savedCandidate);
  } catch (error) {
    console.error('Error adding candidate:', error);
    res.status(500).json({ error: 'Failed to add candidate' });
  }
});

// POST /api/match → accepts { requiredSkills: [], minExperience: number }
app.post('/api/match', async (req, res) => {
  try {
    const { requiredSkills, minExperience } = req.body;
    const candidates = await Candidate.find();
    
    const matchedCandidates = candidates.map(candidate => {
      let score = 0;
      let matchedSkills = [];
      
      const reqSkillsLower = requiredSkills.map(s => s.toLowerCase());
      
      candidate.skills.forEach(skill => {
        if (reqSkillsLower.includes(skill.toLowerCase())) {
          score += 1;
          matchedSkills.push(skill);
        }
      });
      
      const matchScore = requiredSkills.length > 0 
        ? Math.round((score / requiredSkills.length) * 100) 
        : 0;

      const experienceMet = candidate.experience >= minExperience;
      
      return {
        ...candidate.toObject(),
        matchScore,
        matchedSkills,
        experienceMet
      };
    }).sort((a, b) => b.matchScore - a.matchScore);

    res.json(matchedCandidates);
  } catch (error) {
    console.error('Error matching candidates:', error);
    res.status(500).json({ error: 'Failed to match candidates' });
  }
});

// POST /api/ai/shortlist → calls OpenRouter
app.post('/api/ai/shortlist', async (req, res) => {
  try {
    const { requiredSkills, minExperience } = req.body;
    const candidates = await Candidate.find();

    const prompt = `
      You are an expert technical recruiter. I have a job requirement and a list of candidates.
      Job Requirements:
      - Required Skills: ${requiredSkills.join(', ')}
      - Minimum Experience: ${minExperience} years
      
      Candidates:
      ${candidates.map(c => `- ID: ${c._id}, Name: ${c.name}, Experience: ${c.experience} years, Skills: ${c.skills.join(', ')}, Bio: ${c.bio}`).join('\n')}
      
      Please rank the candidates based on how well they match the requirements. 
      Return a JSON object containing an array called "shortlist". Each object in the array should have:
      "id" (the candidate ID), "rank" (1 for best), "score" (a percentage from 0-100 indicating match quality), and "explanation" (a brief explanation of why they received this score and rank).
    `;

    const completion = await openai.chat.completions.create({
      model: "openai/gpt-4o",
      messages: [
        { role: "system", content: "You are a helpful assistant designed to output JSON objects." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    let aiResponseText = completion.choices[0].message.content;
    aiResponseText = aiResponseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const aiResponse = JSON.parse(aiResponseText);
    
    // Merge AI response with candidate data
    const results = aiResponse.shortlist.map(aiItem => {
      const candidate = candidates.find(c => c._id.toString() === aiItem.id);
      if (!candidate) return null;
      return {
        ...candidate.toObject(),
        rank: aiItem.rank,
        matchScore: aiItem.score,
        explanation: aiItem.explanation
      };
    }).filter(Boolean).sort((a, b) => a.rank - b.rank);

    res.json(results);
  } catch (error) {
    console.error('Error AI shortlisting:', error);
    res.status(500).json({ error: 'Failed to generate AI shortlist' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

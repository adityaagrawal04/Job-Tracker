import { GoogleGenAI, Type, Schema } from "@google/genai";
import { JobApplication, JobStatus, STATUS_LABELS } from "../types";

// Initialize Gemini client
// Note: In a real Cloud Run app, this would likely be proxied via a backend service to protect the key,
// or the key would be fetched from Secret Manager.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const parseJobFromEmail = async (emailBody: string): Promise<Partial<JobApplication> & { summary?: string }> => {
  const modelId = "gemini-2.5-flash";
  
  const prompt = `
    Analyze the following email text which is suspected to be related to a job application.
    Extract the company name, job title, and determine the current status of the application based on the content.
    
    Email Content:
    "${emailBody}"
  `;

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      company: { type: Type.STRING, description: "Name of the company" },
      title: { type: Type.STRING, description: "Job title or role" },
      status: { 
        type: Type.STRING, 
        enum: [
            JobStatus.APPLIED, 
            JobStatus.SCREENING, 
            JobStatus.INTERVIEW, 
            JobStatus.OFFER, 
            JobStatus.REJECTED
        ],
        description: "Inferred status of the application" 
      },
      confidence: { type: Type.NUMBER, description: "Confidence score 0-1" },
      summary: { type: Type.STRING, description: "Brief summary of the email content" }
    },
    required: ["company", "title", "status"],
  };

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const text = response.text;
    if (!text) return {};
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Error parsing email with Gemini:", error);
    return {
      company: "Unknown Company",
      title: "Unknown Role",
      status: JobStatus.APPLIED
    };
  }
};

export const getCareerAdvice = async (job: JobApplication): Promise<string> => {
  const modelId = "gemini-2.5-flash";
  
  const prompt = `
    I have a job application for the role of "${job.title}" at "${job.company}".
    The current status is "${STATUS_LABELS[job.status] || job.status}".
    
    Provide 3 concise, actionable, and high-impact tips for me at this specific stage.
    If the status is Rejected, provide encouraging advice on how to pivot or ask for feedback.
    Keep the tone professional and encouraging. Max 100 words.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
    });
    return response.text || "No advice available at the moment.";
  } catch (error) {
    console.error("Error getting advice:", error);
    return "Unable to generate advice. Please check your connection.";
  }
};
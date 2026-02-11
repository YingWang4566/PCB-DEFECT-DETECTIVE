export interface TestCase {
  id: number;
  name: string;
  imageSrc: string;
  referenceSrc: string;
  defectSrc: string; // New field for annotated defect image
  description: string;
}

export interface InspectionResult {
  text: string;
  timestamp: string;
}

export interface OpenRouterResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}
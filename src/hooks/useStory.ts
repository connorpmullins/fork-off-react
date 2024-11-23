import { useState } from "react";
import { generateStoryForks } from "../openaiService";

type UseStoryReturn = {
  loading: boolean;
  error: string | null;
  story: string[];
  forks: string[];
  addFork: () => Promise<void>;
  selectFork: (selectedFork: string) => void;
};

const useStory = (): UseStoryReturn => {
  const [story, setStory] = useState<string[]>(["Once upon a time..."]);
  const [forks, setForks] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const addFork = async (): Promise<void> => {
    setLoading(true);
    setError(null); // Clear any previous errors
    try {
      const context = story.join(" ");
      const generatedForks = await generateStoryForks(context);
      setForks(generatedForks);
      console.log("Generated forks:", generatedForks);
    } catch (err) {
      console.error("Error generating forks:", err);
      setError("Failed to generate story forks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const selectFork = (selectedFork: string): void => {
    setStory((prevStory) => [...prevStory, selectedFork]); // Add the selected fork to the story
    setForks([]); // Clear the forks after a selection
  };

  return {
    loading,
    error,
    story,
    forks,
    addFork,
    selectFork,
  };
};

export default useStory;

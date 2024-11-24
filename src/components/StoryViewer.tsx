import React from "react";

interface StoryViewerProps {
  story: string[];
}

export const StoryViewer: React.FC<StoryViewerProps> = ({ story }) => (
  <div className="story-viewer">
    <h2 className="story-viewer-title">Story So Far:</h2>
    <p className="story-viewer-content">{story.join(" ")}</p>
  </div>
);

export const sanitizeSongName = (name: string): string => {
  return (
    name
      // Remove anything in parentheses
      .replace(/\s*\(.*?\)/g, "")
      // Remove anything after " - " (space-dash-space)
      .replace(/ - .*/, "")
      // Remove “Remastered”, “Live”, etc. keywords
      .replace(/\b(remastered|live|from the .+?|version)\b/gi, "")
      // Collapse multiple spaces and trim
      .replace(/\s+/g, " ")
      .trim()
  );
};

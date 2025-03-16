// Custom hook to standardize grade display across components
export const useGradeDisplay = () => {
  const formatGrade = (grade: string) => {
    switch (grade) {
      case "mcb": return "MCB";
      case "mca": return "MCA";
      case "professor": return "Professor";
      case "substitute": return "Substitute";
      default: return grade;
    }
  };

  const getGradeVariant = (grade: string) => {
    switch (grade) {
      case "mcb": return "outline";
      case "mca": return "secondary";
      case "professor": return "default";
      case "substitute": return "destructive";
      default: return "outline";
    }
  };

  return {
    formatGrade,
    getGradeVariant
  };
};
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, BookOpen, CheckCircle, XCircle, Award, Users, Clock } from "lucide-react"

import { useStudentSubjectId } from "../hooks/use-student-class-id";
import { useGetStudentSummary } from "../api/use-get-student-summary";


export function StudentAttendanceSummary() {
  const subjectId = Number(useStudentSubjectId());
  const { data, isLoading } = useGetStudentSummary({
    subjectId,
  });
  
  const { studentSubject } = data || {};

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!studentSubject) {
    return <div>No data available</div>;
  }

  const subject = studentSubject.subject;
  const assessments = studentSubject.assessments || [];

  const nonExamAssessments = assessments.filter((assessment) => assessment.assessmentType !== "exam")
  const totalGrades = nonExamAssessments.reduce(
    (sum, assessment) => sum + Number.parseFloat(assessment.assignmentGrade || "0"),
    0,
  )

  const averageGrade = nonExamAssessments.length > 0 ? (totalGrades / nonExamAssessments.length).toFixed(2) : "N/A"
  const totalAbsence = subject.totalAbsence
  const totalParticipation = subject.totalParticipation

  return (
    <Card className="w-full shadow-md">
    <CardHeader className="pb-2">
      <div className="flex justify-between items-start">
        <div>
          <CardTitle className="text-xl font-bold">{subject.subjectName}</CardTitle>
          <CardDescription>Subject ID: {subject.id}</CardDescription>
        </div>
        <div
          className={`px-3 py-1 rounded-full border ${getStatusColor(subject.subjectStatus)} flex items-center gap-1.5`}
        >
          {getStatusIcon(subject.subjectStatus)}
          <span className="font-medium capitalize">{subject.subjectStatus}</span>
        </div>
      </div>
    </CardHeader>

    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Average Grade</p>
          <p className="text-2xl font-bold">{averageGrade}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Total Participation</p>
          <p className="text-2xl font-bold">{totalParticipation}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Total Absences</p>
          <p className="text-2xl font-bold">{totalAbsence}</p>
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-3">Assessment Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {assessments.map((assessment) => (
          <Card key={assessment.teacherAssignmentId} className="border shadow-sm">
            <CardHeader className="pb-2 pt-4 px-4">
              <div className="flex justify-between items-center">
                <Badge
                  variant={
                    assessment.assessmentType === "exam"
                      ? "destructive"
                      : assessment.assessmentType === "td"
                        ? "secondary"
                        : "default"
                  }
                  className="flex items-center gap-1"
                >
                  {getAssessmentTypeIcon(assessment.assessmentType)}
                  {getAssessmentTypeLabel(assessment.assessmentType)}
                </Badge>
                {assessment.assessmentType !== "exam" && (
                  <span className="font-semibold text-lg">{assessment.assignmentGrade}</span>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-2 px-4 pb-4">
              <div className="text-sm">
                <p className="text-gray-700 mb-1">{assessment.teacherName}</p>
                {assessment.assessmentType !== "exam" && (
                  <div className="flex justify-between mt-2">
                    <div>
                      <p className="text-xs text-gray-500">Participation</p>
                      <p className="font-medium">{assessment.participationNumber}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Absences</p>
                      <p
                        className={`font-medium ${Number.parseInt(assessment.absenceNumber) > 0 ? "text-red-600" : ""}`}
                      >
                        {assessment.absenceNumber}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </CardContent>
  </Card>
  );
}

  // Helper function to get assessment type label
  const getAssessmentTypeLabel = (type: "exam" | "td" | "tp") => {
    switch (type) {
      case "exam":
        return "Exam"
      case "td":
        return "TD"
      case "tp":
        return "TP"
      default:
        return type
    }
  }

  // Helper function to get assessment type icon
  const getAssessmentTypeIcon = (type: "exam" | "td" | "tp") => {
    switch (type) {
      case "exam":
        return <Award className="h-5 w-5" />
      case "td":
        return <Users className="h-5 w-5" />
      case "tp":
        return <Clock className="h-5 w-5" />
      default:
        return <BookOpen className="h-5 w-5" />
    }
  }
  
  // Helper function to get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "excluded":
        return "bg-red-100 text-red-800 border-red-200"
      case "warning":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "good":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }
  
  // Helper function to get status icon
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "excluded":
        return <XCircle className="h-5 w-5 text-red-600" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-amber-600" />
      case "good":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      default:
        return <BookOpen className="h-5 w-5 text-gray-600" />
    }
  }
  
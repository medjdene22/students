'use client'
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// import { toast } from "@/components/ui/use-toast";

export default function JustificationPage() {
  const [loading, setLoading] = useState(false);
  const [subjectEventId, setSubjectEventId] = useState("");
  const [justificationType] = useState<"session" | "test">("session");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subjectEventId || !justificationType || !file) {
      // toast({
      //   title: "Missing fields",
      //   description: "Please fill all required fields",
      //   variant: "destructive",
      // });
      return;
    }

    try {
      setLoading(true);
      
      const formData = new FormData();
      formData.append('notes', notes);
      formData.append('image', file);
      
      const response = await fetch(`/api/justification/subject/${subjectEventId}`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Something went wrong');
      }
      
      const result = await response.json();
      
      // toast({
      //   title: "Success!",
      //   description: "Justification submitted successfully",
      // });
      
      console.log("API response:", result);
      
    } catch (error) {
      console.error("Error submitting justification:", error);
      // toast({
      //   title: "Error",
      //   description: error instanceof Error ? error.message : "Failed to submit justification",
      //   variant: "destructive",
      // });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Submit Absence Justification</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
        <div className="space-y-2">
          <Label htmlFor="subjectEventId">Subject Event ID</Label>
          <Input
            id="subjectEventId"
            value={subjectEventId}
            onChange={(e) => setSubjectEventId(e.target.value)}
            placeholder="Enter subject event ID"
            required
          />
        </div>
        
        
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any additional notes here"
            rows={3}
          />
        </div>
        
        
        
        <div className="space-y-2">
          <Label htmlFor="file">Upload Justification Document</Label>
          <Input 
            id="file" 
            type="file" 
            onChange={handleFileChange}
            accept=".pdf,.jpg,.jpeg,.png" 
            required
          />
          <p className="text-sm text-gray-500">Supports PDF, JPEG, and PNG files</p>
        </div>
        
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Submitting..." : "Submit Justification"}
        </Button>
      </form>
    </div>
  );
}

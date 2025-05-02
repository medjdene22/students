import { X, Maximize2, FileText, Download } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

interface FileUploaderProps {
  value: File | string | undefined;
  onChange: (file: File | undefined) => void;
  accept?: string;
}

export const FileUploader = ({
  value,
  onChange,
  accept = "image/*",
}: FileUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        window.innerWidth < 768 || /Mobi|Android/i.test(navigator.userAgent),
      );
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Handle initial value - could be a File or data URL string
  useEffect(() => {
    if (value instanceof File) {
      // For File objects, create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(value);
    } else if (typeof value === "string" && value.startsWith("data:")) {
      // Value is already a data URL string
      setPreview(value);
    }
  }, [value]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering parent click events
    onChange(undefined);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const isImage = (fileOrUrl: File | string) => {
    if (fileOrUrl instanceof File) {
      return fileOrUrl.type.startsWith("image/");
    } else if (typeof fileOrUrl === "string") {
      return fileOrUrl.startsWith("data:image/");
    }
    return false;
  };

  const isPdf = (fileOrUrl: File | string) => {
    if (fileOrUrl instanceof File) {
      return fileOrUrl.type === "application/pdf";
    } else if (typeof fileOrUrl === "string") {
      return fileOrUrl.startsWith("data:application/pdf");
    }
    return false;
  };

  return (
    <div className="space-y-4">
      <div
        className="border-2 border-dashed rounded-lg p-4 hover:bg-muted/50 transition cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={accept}
          className="hidden"
        />
        <div className="flex flex-col items-center justify-center gap-2 py-4">
          <p className="text-sm text-muted-foreground text-center">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-muted-foreground">
            Supported formats: PDF, JPG, PNG
          </p>
        </div>
      </div>

      {value && (
        <Dialog>
          <div className="relative border rounded-md p-2">
            <div className="flex items-center gap-2">
              {isImage(value) && preview ? (
                <DialogTrigger asChild>
                  <div className="relative w-12 h-12 overflow-hidden rounded cursor-pointer hover:opacity-80 transition">
                    <Image
                      src={preview}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition">
                      <Maximize2 className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </DialogTrigger>
              ) : isPdf(value) ? (
                // For PDF, offer both preview and download options
                <div className="flex gap-1">
                  <DialogTrigger asChild>
                    <div className="w-12 h-12 bg-muted rounded flex items-center justify-center cursor-pointer hover:bg-muted/80 transition">
                      <FileText className="h-6 w-6 text-muted-foreground" />
                    </div>
                  </DialogTrigger>
                </div>
              ) : (
                <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                  <span className="text-xs">File</span>
                </div>
              )}

              <div className="flex-1 truncate">
                <p className="text-sm font-medium truncate">
                  {value instanceof File ? value.name : "Uploaded document"}
                </p>
                {value instanceof File && (
                  <p className="text-xs text-muted-foreground">
                    {(value.size / 1024).toFixed(2)} KB
                  </p>
                )}
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleRemoveFile}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <DialogContent className="max-w-4xl w-full p-0">
            {isImage(value) && preview && (
              <div className="relative w-full h-[80vh] overflow-auto">
                <Image src={preview} alt="Preview" className="w-full h-auto" />
              </div>
            )}
            {isPdf(value) && preview && (
              <div className="w-full h-[80vh] flex flex-col">
                {isMobile ? (
                  <div className="flex flex-col items-center justify-center h-full gap-4 p-4">
                    <FileText className="h-12 w-12 text-muted-foreground" />
                    <p className="text-center text-muted-foreground">
                      PDF viewer may not work well on some mobile devices.
                    </p>
                    <a
                      href={preview}
                      download="document.pdf"
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Download className="h-4 w-4" />
                      Download PDF
                    </a>
                  </div>
                ) : (
                  <iframe
                    src={preview}
                    className="w-full h-full"
                    title="PDF Viewer"
                    frameBorder="0"
                  />
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

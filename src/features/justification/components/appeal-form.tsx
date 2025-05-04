import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { FileUploader } from "@/components/file-uploader";
import { createJustificationSchima } from "@/features/justification/schema";
import { useSubmitJustification } from "../api/submit-justification";
import { useUpdateJustification } from "../api/update-justification";

interface AppealProps {
  onCancel?: () => void;
  eventId: string;
  type: "session" | "test";

  justification:
    | {
        id: number;
        notes: string | null;
        fileData: string | null; // Base64 encoded file data
        fileType: string | null;
        submitDate: string;
        status: "pending" | "approved" | "rejected";
      }
    | undefined;
  file: string | undefined;
}

export const AppealForm = ({
  onCancel,
  eventId,
  type,
  justification,
  file,
}: AppealProps) => {
  const { mutate: submit, isPending: isPendingSubmit } = useSubmitJustification();
  const { mutate: update, isPending: isPendingUpdate } = useUpdateJustification();
  const isPending = isPendingSubmit || isPendingUpdate;

  const form = useForm<z.infer<typeof createJustificationSchima>>({
    resolver: zodResolver(createJustificationSchima),
    defaultValues: {
      notes: justification?.notes ?? "",
      image: justification?.fileData ? file : undefined,
    },
  });

  function onSubmit(values: z.infer<typeof createJustificationSchima>) {
    if (!!justification?.id) {
      console.log("update")
      update(
        {
          param: { eventId, justificationId: justification.id.toString(), type },
          form: values,
        },
        {
          onSuccess: () => {
            onCancel?.();
          },
        },
      );
      return;
    }
    else {
      console.log("submit")
      submit(
        {
          param: { eventId, type },
          form: values,
        },
        {
          onSuccess: () => {
            onCancel?.();
          },
        },
      );
    }
      
  }

  return (
    <div className="w-full lg:w-[500px] bg-background p-6 rounded-lg">
      <div className="flex flex-col space-y-4">
        <h1 className="text-xl font-bold">Appeal Absence</h1>
        <p className="text-muted-foreground">
          Submit your justification for this absence. Attach any relevant
          documentation.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Justification</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Explain the reason for your absence..."
                      className="resize-none min-h-20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supporting Document</FormLabel>
                  <FormControl>
                    <FileUploader
                      value={field.value}
                      onChange={field.onChange}
                      accept="image/*,.pdf"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                
                {!!justification?.id ? 
                isPending ? "Updating..." : "Update Justification" :
                isPending ? "Submitting..." : "Submit Justification"
                }
              </Button>
              
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

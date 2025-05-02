import { JustificationList } from "@/features/justification/components/justification-list";
import JustificationModel from "@/features/justification/components/justification-model";


export default function Page() {
  return (
    <div className="flex flex-col gap-4">


            <JustificationList />
            <JustificationModel />
    </div>
  );
}
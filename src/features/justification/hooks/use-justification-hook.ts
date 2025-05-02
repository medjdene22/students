import { JustificationType } from "@/lib/types";
import { create } from "zustand";

type Justification = {
  eventId: number;
  type: JustificationType;
  isOpen: boolean;
  onOpen: (eventId: number, type: JustificationType) => void;
  onClose: () => void;
}

export const useJustificationmodel = create<Justification>((set) => ({
  eventId: 0,
  type: JustificationType.SESSION,
  test: undefined,
  isOpen: false,
  onOpen: (eventId, type) => set({ isOpen : true, eventId, type }),
  onClose: () => set({ isOpen: false, eventId: undefined, type: undefined })
  
}));

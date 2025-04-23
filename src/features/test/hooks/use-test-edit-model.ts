import { create } from "zustand";

type TestToEdit = {
  id: number;
  name: string;
  testDate: string | Date;
  replacementDate: string | Date | null | undefined;
  teacherAssignmentId: string;
}

type TestEditModelStore = {
  test?: TestToEdit ;
  isOpen: boolean;
  onOpen: (test: TestToEdit) => void;
  onClose: () => void;
}

export const useTestEditModel = create<TestEditModelStore>((set) => ({
  test: undefined,
  isOpen: false,
  onOpen: (test) => set({ isOpen : true, test }),
  onClose: () => set({ isOpen: false, test: undefined })
}));

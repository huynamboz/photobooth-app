import { create } from 'zustand';

interface ConfirmDialogData {
  title: string;
  message?: string;
  isOnlyConfirm?: boolean;
  confirmButton?: {
    text?: string;
    variant?: 'primary' | 'secondary' | 'destructive';
  };
  cancelButton?: {
    text?: string;
    variant?: 'primary' | 'secondary' | 'destructive';
  };
}

interface ConfirmDialogStore {
  dialogData: ConfirmDialogData;
  confirm: (data: ConfirmDialogData) => Promise<boolean>;
  resolveConfirm: (isConfirmed: boolean) => void;
  confirmResolver: ((isConfirmed: boolean) => void) | null;
  isOpen?: boolean;
}

const defaultDialogData: ConfirmDialogData = {
  title: '',
  message: '',
  isOnlyConfirm: false,
  confirmButton: { text: 'Confirm', variant: 'destructive' },
  cancelButton: { text: 'Cancel', variant: 'secondary' },
};

export const useConfirmDialogStore = create<ConfirmDialogStore>()((set, get) => ({
  dialogData: defaultDialogData,
  confirmResolver: null,

  confirm: (data: ConfirmDialogData) => {
    const { confirmResolver } = get();
    if (confirmResolver) {
      confirmResolver(false); // Resolve any previous confirmation
      set({ confirmResolver: null });
    }

    return new Promise<boolean>((resolve) => {
      set({ dialogData: { ...defaultDialogData, ...data } });
      const resolver = (isConfirmed: boolean) => {
        set({ isOpen: false, confirmResolver: null });
        // Reset dialog data after confirmation
        set({ dialogData: defaultDialogData });
        resolve(isConfirmed);
      };

      set({ confirmResolver: resolver, isOpen: true });
    });
  },

  resolveConfirm: (isConfirmed: boolean) => {
    const { confirmResolver } = get();
    if (confirmResolver) {
      confirmResolver(isConfirmed);
      set({ confirmResolver: undefined });
    }
  },
}));

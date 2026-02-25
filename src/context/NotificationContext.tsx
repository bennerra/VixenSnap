import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Notification } from "@/ui/Notification/Notification";

type NotificationContextState = {
  showNotification: (message: string) => void;
};

export const NotificationContext = createContext<NotificationContextState>({
  showNotification: () => {},
});

export const NotificationLayout: FC<PropsWithChildren> = ({ children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [text, setText] = useState<string>("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleOpen = useCallback(() => {
    setIsOpen(true);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      handleClose();
    }, 5000);
  }, [handleClose]);

  const showNotification = useCallback(
    (message: string) => {
      setText(message);
      handleOpen();
    },
    [handleOpen]
  );

  const contextValue = useMemo(
    () => ({ showNotification }),
    [showNotification]
  );

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      {isOpen && <Notification text={text} onClose={handleClose} />}
    </NotificationContext.Provider>
  );
};

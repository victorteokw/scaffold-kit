interface Message {
  message: string;
  file?: string;
  dependency?: string;
  command?: string;
  config?: string;
}

interface Reporter {
  flush: () => void;
  push: (message: Message) => void;
}

export default Reporter;

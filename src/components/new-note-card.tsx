import * as Dialog from "@radix-ui/react-dialog";
import { X, ArrowUpRight } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "sonner";

interface NewNoteCardProsp {
  onNoteCreated: (content: string) => void;
}

let speechRecognition: SpeechRecognition | null = null;

export function NewNoteCard({ onNoteCreated }: NewNoteCardProsp) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [sholdShowOnboarding, setSholdShowOnboarding] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [content, setContent] = useState<string>("");

  const handleStartEditor = () => {
    setSholdShowOnboarding(false);
  };

  const handleStartRecording = () => {
    const isSpeechRecognitionAPIAvailable =
      "SpeechRecognition" in window || "webkitSpeechRecognition" in window;

    if (!isSpeechRecognitionAPIAvailable) {
      alert(
        "Infelizmente seu navegador não suporta a API de gravação." +
          "Recomendamos que utilize o Chrome, Mozilla ou Safari."
      );
      return;
    }

    setIsRecording(true);
    setSholdShowOnboarding(false);

    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    speechRecognition = new SpeechRecognitionAPI();
    speechRecognition.lang = "pt-BR";
    speechRecognition.continuous = true; // eu devido quando parar
    speechRecognition.maxAlternatives = 1; // alternativas de palavras semelhantes ao que foi dito
    speechRecognition.interimResults = true; // traga imediatamente, antes mesmo de eu terminar de falar

    speechRecognition.onresult = (event) => {
      const transcription = Array.from(event.results).reduce((text, result) => {
        return text.concat(result[0].transcript);
      }, "");
      setContent(transcription);
    };

    speechRecognition.onerror = (event) => {
      console.error(event);
    };

    speechRecognition.start();
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    if (speechRecognition) {
      speechRecognition.stop();
    }
  };

  const handleContentChanged = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value);
    if (event.target.value === "") {
      setSholdShowOnboarding(true);
    }
  };

  const handleSaveNote = (event: FormEvent) => {
    event.preventDefault();

    if (content === "") {
      return;
    }

    onNoteCreated(content);
    setContent("");
    setSholdShowOnboarding(true);
    toast.success("Nota criada com sucesso!");
  };

  const handleModal = () => {
    setModalIsOpen(!modalIsOpen);
    if (!modalIsOpen && content !== "") {
      setContent("");
      setSholdShowOnboarding(true);
    }
  };

  return (
    <Dialog.Root open={modalIsOpen} onOpenChange={handleModal}>
      <Dialog.Trigger
        className="flex flex-col rounded-md bg-slate-700
        text-left p-5 gap-3 outline-none hover:ring-2 hover:ring-slate-600 
        focus-visible:ring-2 focus-visible:ring-lime-400 
        relative overflow-hidden"
      >
        <ArrowUpRight
          size={"1.25rem"}
          className="absolute top-0 right-0 w-8 h-8 p-1.5
          bg-slate-800 text-slate-600"
        />
        <span className="text-sm font-medium text-slate-200">
          Adicionar nota
        </span>
        <p className="text-sm leading-6 text-slate-400">
          Grave uma nota em áudio que será convertida para texto
          automaticamente.
        </p>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="inset-0 fixed bg-black/50" />
        <Dialog.Content
          className="fixed overflow-hidden w-full inset-0 
            md:inset-auto md:left-1/2 md:top-1/2 md:rounded-md
            md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] md:h-[60vh] 
          bg-slate-700 flex flex-col outline-none"
        >
          <Dialog.Close
            className="absolute right-0 top-0
           bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100"
          >
            <X size={"1rem"} />
          </Dialog.Close>

          <form className="flex flex-col flex-1">
            <div className="flex flex-1 flex-col gap-3 p-5">
              <span className="text-sm font-medium text-slate-300">
                Adicionar nota
              </span>
              {sholdShowOnboarding ? (
                <p className="text-sm leading-6 text-slate-400">
                  Comece{" "}
                  <button
                    type="button"
                    onClick={handleStartRecording}
                    className="font-medium text-lime-400 hover:underline"
                  >
                    gravando uma nota
                  </button>{" "}
                  em áudio ou se preferir{" "}
                  <button
                    type="button"
                    onClick={handleStartEditor}
                    className="font-medium text-lime-400 hover:underline"
                  >
                    utilize apenas texto
                  </button>
                  .
                </p>
              ) : (
                <textarea
                  autoFocus
                  className="text-sm leading-6 text-slate-40 bg-transparent
                resize-none flex-1 outline-none"
                  onChange={handleContentChanged}
                  value={content}
                ></textarea>
              )}
            </div>

            {isRecording ? (
              <button
                type="button"
                onClick={handleStopRecording}
                className="w-full bg-slate-900 py-4 outline-none
                  text-sm text-center text-slate-300 font-medium 
                  hover:text-slate100 flex items-center justify-center gap-2"
              >
                <div className="size-3 rounded-full bg-red-500 animate-pulse" />
                Gravando... (clique para interromper)
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSaveNote}
                className="w-full bg-lime-400 py-4 outline-none
              text-sm text-center text-lime-950 font-medium 
              hover:bg-lime-500"
              >
                Salvar nota
              </button>
            )}
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
